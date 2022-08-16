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
  private moving: boolean = false;

  /**
   * revert 队列，等待上一个 revert 结束会自动
   * 检索该队列
   */
  private moveQueue: {
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
  public revert() {
    return this.move(-1);
  }

  /** revert 的反操作 */
  public unRevert() {
    return this.move(1);
  }

  /** 监听事件 */
  public listen(type: string, handler: () => void) {
    return this.eventCenter.listen(type, handler);
  }

  /** 解除监听 */
  public unlisten(type: string, handerId: string) {
    this.eventCenter.unlisten(type, handerId);
  }

  /** 移动到某个 commit */
  private move(offset: number) {
    const nextIndex = this.getNextIndex(offset);
    if (nextIndex < -1 || nextIndex > this.snapshotsStack.length - 1) {
      return;
    }

    if (this.moving) {
      this.moveQueue.push({
        createTime: new Date().getTime(),
        offset: offset,
      });
      return;
    }

    return this.moveTarget(offset);
  }

  /**
   * 恢复到指定的 commit
   * offset 是从栈顶部开始，0 表示当前为栈顶，-1 表示从栈顶倒退 1 次
   */
  private moveTarget = async (offset: number) => {
    if (this.snapshotsStack.length === 0) {
      return;
    }

    this.startReverting();

    /**
     * 如果快照数量为 1，并且 offset 为 -1
     * 那么退回的状态为空状态，交由组件自己处理
     */
    const nextIndex = this.getNextIndex(offset);
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

      if (this.moveQueue.length) {
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

  private getNextIndex = (offset: number) => {
    return this.index + offset;
  };

  /** 检测并开始队列中的下一个 revert */
  private nextRevert() {
    if (this.moveQueue.length) {
      const item = this.moveQueue.shift();
      if (item) {
        this.move(item.offset);
      }
    }
  }

  /** 丢弃所有 revertQueue */
  private dropAllRevertQueue() {
    this.moveQueue = [];
  }

  private stopReverting() {
    this.moving = false;
  }

  private startReverting() {
    this.moving = true;
  }
}
