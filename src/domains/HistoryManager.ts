import utl from 'lodash';
import { nanoid } from 'nanoid';
import { EventManager } from './EventManager';

export type RecoverParams<S = any, C = any> = {
  index: number;
  state: S;
  commitInfo: C;
  prevNode?: SnapshotsNode<S, C>;
  nextNode?: SnapshotsNode<S, C>;
  direction: 'back' | 'forward' | 'stand';
  offset: number;
};

export type HistoryAreaInitParams = {
  name: string;
  recover: (opts: RecoverParams) => Promise<boolean>;
  backRecover: (opts: RecoverParams) => Promise<boolean>;
  initialState?: () => any;
};

export class HistoryArea {
  public name: string;
  private _backRecover: (opts: RecoverParams) => Promise<boolean>;
  private _recover: (opts: RecoverParams) => Promise<boolean>;
  private _initialState?: () => any;

  constructor({
    name,
    recover,
    backRecover: backLatestRecover,
    initialState,
  }: HistoryAreaInitParams) {
    this.name = name;
    this._backRecover = backLatestRecover;
    this._recover = recover;
    this._initialState = initialState;
  }

  /** 恢复到指定快照 */
  public recover(opts: RecoverParams) {
    return this._recover(opts);
  }

  /** recover 的反操作 */
  public backLatestRecover(opts: RecoverParams) {
    return this._backRecover(opts);
  }

  public getInitialState() {
    return this._initialState?.();
  }
}

export type AreaSnapshot<S = any, C = any> = {
  state: S;
  commitInfo: C;
};

export type SnapshotsNode<S = any, C = any> = {
  id: string;
  areasSnapshots: Record<string, AreaSnapshot<S, C>>;
};

export class HistoryManager {
  /** 分区域管理自身的状态 */
  public areas: Record<string, HistoryArea> = {};

  /** 所有区域的线形历史状态集 */
  public snapshotsStack: SnapshotsNode[] = [];

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
  public init(shs: SnapshotsNode[]) {
    this.snapshotsStack = shs;
    this.eventCenter.dispatch('inited', {
      data: {
        snapshotsStack: this.snapshotsStack,
      },
    });
  }

  /** 栈顶部增加一个快照节点 */
  public commit(
    ...infoArr: [
      string,
      {
        commitInfo: any;
        state: any;
      },
    ][]
  ) {
    /**
     * 如果当前 index 在中间位置，新增 commit 前要丢弃后面的 commit
     * @TODO 增加异步同步
     */
    if (this.index < this.snapshotsStack.length - 1) {
      this.snapshotsStack = this.snapshotsStack.slice(0, this.index + 1);
    }

    const infos = utl.fromPairs(infoArr);

    const commitId = nanoid();
    const node = Object.keys(infos).reduce(
      (acc, areaName) => {
        return {
          ...acc,
          areasSnapshots: {
            ...acc.areasSnapshots,
            [areaName]: {
              state: infos[areaName].state,
              commitInfo: infos[areaName].commitInfo,
            },
          },
        };
      },
      {
        id: commitId,
        areasSnapshots: {},
      } as SnapshotsNode,
    );
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
  public move(offset: number) {
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
     * 那么退回的状态为空状态
     */
    const nextIndex = this.getNextIndex(offset);
    const node = this.snapshotsStack[nextIndex] as SnapshotsNode | undefined;
    const prevNode = this.snapshotsStack[nextIndex - 1] as
      | SnapshotsNode
      | undefined;
    const nextNode = this.snapshotsStack[nextIndex + 1] as
      | SnapshotsNode
      | undefined;

    this.eventCenter.dispatch('reverting', {});

    const results = await Promise.all(
      /**
       * 如果 nextIndex 为 -1，则找到 index 为 0 的 node，
       * 因为它存在的 areas 就是变化量的 areas，对应的 state
       * 我们取对应的 initialState
       */
      Object.keys(
        nextIndex === -1
          ? this.snapshotsStack[0].areasSnapshots
          : node?.areasSnapshots ?? {},
      ).map((areaName) => {
        const meta = node?.areasSnapshots?.[areaName] as
          | AreaSnapshot
          | undefined;
        return this.areas[areaName]
          .recover({
            state:
              nextIndex === -1
                ? this.areas[areaName].getInitialState()
                : meta?.state,
            commitInfo: meta?.commitInfo,
            index: nextIndex,
            prevNode,
            nextNode,
            direction: offset < 0 ? 'back' : offset === 0 ? 'stand' : 'forward',
            offset,
          })
          .then((result) => {
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
