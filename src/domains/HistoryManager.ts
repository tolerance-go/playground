import { nanoid } from 'nanoid';
import { EventManager } from './EventManager';

export type HistoryAreaInitParams = {
  name: string;
  pull: () => any;
  recover: (state: any) => Promise<boolean>;
  backLatestRecover: () => void;
};

export class HistoryArea {
  public name: string;
  private _pull: () => void;
  private _backLatestRecover: () => void;
  private _recover: (state: any) => Promise<boolean>;

  constructor({
    name,
    pull,
    recover,
    backLatestRecover,
  }: HistoryAreaInitParams) {
    this.name = name;
    this._pull = pull;
    this._backLatestRecover = backLatestRecover;
    this._recover = recover;
  }

  /** 返回支持 recover 的数据 */
  public pull() {
    return this._pull();
  }

  /** 恢复到指定快照 */
  public recover(state: any) {
    return this._recover(state);
  }

  /** recover 的反操作 */
  public backLatestRecover() {
    return this._backLatestRecover();
  }
}

export type SnapshotNode = {
  id: string;
  state: any;
};

export class HistoryManager {
  /** 分区域管理自身的状态 */
  public areas: Record<string, HistoryArea> = {};

  /** 所有区域的线形历史状态集 */
  public snapshotsStack: Record<string, SnapshotNode>[] = [];

  /**
   * 当前快照栈的下标位置
   * index 是从栈顶部开始，0 表示栈底部
   */
  public index: number = -1;

  private eventCenter: EventManager = new EventManager();

  /** 内部标志，当前是否正在回撤 */
  private reverting: boolean = false;

  /**
   * revert 队列，等待上一个 revert 结束会自动
   * 检索该队列
   */
  private revertQueue: {
    createTime: number;
    offset: number;
  }[] = [];

  /** 注册区域 */
  public registerArea(params: HistoryAreaInitParams) {
    if (this.areas[params.name]) {
      throw new Error('area name is repeated');
    }

    const area = new HistoryArea(params);
    this.areas[area.name] = area;
  }

  /** 初始化快照数据 */
  public init(shs: Record<string, any>[]) {
    this.snapshotsStack = shs;
    this.eventCenter.dispatch('inited', {
      data: {
        snapshotsStack: this.snapshotsStack,
      },
    });
  }

  /** 栈顶部增加一个快照节点 */
  public commit() {
    if (this.index < this.snapshotsStack.length - 1) {
      this.snapshotsStack = this.snapshotsStack.slice(0, this.index + 1);
    }

    const nodeId = nanoid();
    const node = Object.keys(this.areas).reduce((acc, areaName) => {
      return {
        ...acc,
        [areaName]: {
          id: nodeId,
          state: this.areas[areaName].pull(),
        },
      };
    }, {});
    this.snapshotsStack.push(node);
    this.index = this.snapshotsStack.length - 1;
  }

  /** 恢复到上一个 commit */
  public revert(offset: number = -1) {
    if (this.index < 0) {
      return;
    }

    if (this.reverting) {
      this.revertQueue.push({
        createTime: new Date().getTime(),
        offset: offset,
      });
      return;
    }

    return this.revertTarget(offset);
  }

  /**
   * 恢复到指定的 commit
   * offset 是从栈顶部开始，0 表示当前为栈顶，-1 表示从栈顶倒退 1 次
   */
  public revertTarget = async (offset: number) => {
    if (this.snapshotsStack.length === 0) {
      return;
    }

    this.startReverting();

    /**
     * 如果快照数量为 1，并且 offset 为 -1
     * 那么退回的状态为空状态，交由组件自己处理
     */
    const nextIndex = this.index + offset;
    const node: Record<string, SnapshotNode> | undefined =
      this.snapshotsStack[nextIndex];

    this.eventCenter.dispatch('reverting', {});

    const results = await Promise.all(
      Object.keys(this.areas).map((areaName) => {
        const meta = node?.[areaName];
        return this.areas[areaName].recover(meta?.state).then((result) => {
          return {
            areaName,
            result,
          };
        });
      }),
    );

    if (results.some((item) => item.result === false)) {
      const falses = results.filter((item) => item.result === false);
      falses.forEach((item) => {
        this.areas[item.areaName].backLatestRecover();
      });

      this.stopReverting();

      this.eventCenter.dispatch('reverted', {
        data: false,
      });

      this.dropAllRevertQueue();

      return false;
    } else {
      this.index = nextIndex;

      if (this.revertQueue.length) {
        this.nextRevert();
      } else {
        this.stopReverting();

        this.eventCenter.dispatch('reverted', {
          data: true,
        });
      }

      return true;
    }
  };

  /** 监听事件 */
  public listen(type: string, handler: () => void) {
    return this.eventCenter.listen(type, handler);
  }

  /** 解除监听 */
  public unlisten(type: string, handerId: string) {
    this.eventCenter.unlisten(type, handerId);
  }

  /** 检测并开始队列中的下一个 revert */
  private nextRevert() {
    if (this.revertQueue.length) {
      const item = this.revertQueue.shift();
      if (item) {
        this.revert(item.offset);
      }
    }
  }

  /** 丢弃所有 revertQueue */
  private dropAllRevertQueue() {
    this.revertQueue = [];
  }

  private stopReverting() {
    this.reverting = false;
  }

  private startReverting() {
    this.reverting = true;
  }
}
