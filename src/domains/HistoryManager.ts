import { message } from 'antd';
import utl from 'lodash';
import { nanoid } from 'nanoid';
import { EventManager } from './EventManager';

export type RecoverParams<S = any, C = any> = {
  index: number;
  state: S;
  commitInfo: C;
  areaName: string;
  currentNode: SnapshotsNode<S, C>;
  prevNode?: SnapshotsNode<S, C>;
  nextNode?: SnapshotsNode<S, C>;
  direction: 'back' | 'forward' | 'stand';
  offset: number;
};

export type RecoverResult = {
  success: boolean;
  errorMessage?: string;
};

export type HistoryAreaInitParams = {
  name: string;
  pull: () => any;
  recover: (opts: RecoverParams) => Promise<RecoverResult>;
  getInitialState: () => any;
};

export class HistoryArea {
  public name: string;
  private _recover: (opts: RecoverParams) => Promise<RecoverResult>;
  private _getInitialState: () => any;
  private _pull: () => any;

  constructor({ name, pull, recover, getInitialState }: HistoryAreaInitParams) {
    this.name = name;
    this._recover = recover;
    this._pull = pull;
    this._getInitialState = getInitialState;
  }

  /** 恢复到指定快照 */
  public recover(opts: RecoverParams) {
    return this._recover(opts);
  }

  public getInitialState() {
    return this._getInitialState();
  }

  public pull() {
    return this._pull();
  }
}

export type AreaSnapshot<S = any, C = any> = {
  state: S;
  commitInfo: C;
};

export type SnapshotsNode<S = any, C = any> = {
  id: string;
  changedAreasSnapshots: Record<string, AreaSnapshot<S, C>>;
  areasSnapshots: Record<string, AreaSnapshot<S, C>>;
  areasRecoverErrors?: {
    direction: RecoverParams['direction'];
    errors: Record<
      string,
      {
        message: string;
      }
    >;
  };
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

  /** 虚拟的初始化 commit node，下标对应为 -1 */
  private virtualInitialNode: SnapshotsNode = {
    id: 'virtualInitialNode',
    changedAreasSnapshots: {},
    areasSnapshots: {},
  };

  /**
   * revert 队列，等待上一个 revert 结束会自动
   * 检索该队列
   */
  private moveQueue: {
    createTime: number;
    offset: 1 | -1 | 0;
  }[] = [];

  /** 注册区域 */
  public registerArea(params: HistoryAreaInitParams) {
    if (this.areas[params.name]) {
      throw new Error('area name is repeated');
    }

    const area = new HistoryArea(params);
    this.areas[area.name] = area;

    this.virtualInitialNode.areasSnapshots[area.name] = {
      state: area.getInitialState(),
      commitInfo: {
        type: 'virtualInitialNodeCommitInfo',
      },
    };
    /** 初始化的时候，所有都作为初始化 */
    this.virtualInitialNode.changedAreasSnapshots[area.name] = {
      ...this.virtualInitialNode.areasSnapshots[area.name],
    };
  }

  /** 初始化快照数据 */
  public init(shs: SnapshotsNode[], index: number) {
    this.snapshotsStack = shs;
    this.index = index;
    this.eventCenter.dispatch('inited', {
      data: {
        snapshotsStack: this.snapshotsStack,
        index: this.index,
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
        const areaSnapshot = {
          state: infos[areaName].state,
          commitInfo: infos[areaName].commitInfo,
        };

        return {
          ...acc,
          changedAreasSnapshots: {
            ...acc.changedAreasSnapshots,
            [areaName]: areaSnapshot,
          },
          /** 这里注意对全量快照进行覆盖，因为 pull 可能拉到的是老的数据 */
          areasSnapshots: {
            ...acc.areasSnapshots,
            [areaName]: areaSnapshot,
          },
        };
      },
      {
        id: commitId,
        changedAreasSnapshots: {},
        areasSnapshots: Object.keys(this.areas).reduce((acc, areaName) => {
          return {
            ...acc,
            [areaName]: {
              state: this.areas[areaName].pull(),
              commitInfo: undefined,
            },
          };
        }, {}),
      } as SnapshotsNode,
    );
    this.snapshotsStack.push(node);
    this.index = this.snapshotsStack.length - 1;

    this.eventCenter.dispatch('updated', {
      data: this.getUpdateEventData(),
    });
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
  public move(offset: -1 | 1 | 0) {
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
   * this.index 的活动范围为 [-1, snapshotsStack.length - 1]
   *
   * @TODO 目前 offset 幅度只能为 1，超过 1 需要处理的情况比较繁琐，后续再支持
   */
  private moveTarget = async (offset: -1 | 1 | 0) => {
    if (this.snapshotsStack.length === 0) {
      return;
    }

    /** 未移动，当前的 node */
    const currentNode =
      this.index === -1
        ? this.virtualInitialNode
        : this.snapshotsStack[this.index];

    /**
     * 如果快照数量为 1，并且 offset 为 -1
     * 那么退回的状态为空状态
     */
    const movedIndex = this.getNextIndex(offset);
    const movedNode =
      movedIndex === -1
        ? this.virtualInitialNode
        : this.snapshotsStack[movedIndex];
    const movedPrevNode = this.snapshotsStack[movedIndex - 1] as
      | SnapshotsNode
      | undefined;
    const movedNextNode = this.snapshotsStack[movedIndex + 1] as
      | SnapshotsNode
      | undefined;
    const direction = offset < 0 ? 'back' : offset === 0 ? 'stand' : 'forward';

    /**
     * 如果上次移动存在错误未解决
     * 1. 这次移动的方向必须和上一次发生错误的方向一致，否则提示用户信息
     * 2. 本次移动 recover 的范围从上次剩余错误中继续
     */
    if (currentNode.areasRecoverErrors) {
      if (currentNode.areasRecoverErrors.direction !== direction) {
        message.warn(
          '上次回退操作存在错误，避免数据不一致，请继续执行相同操作',
        );
        return;
      }
    }

    this.startReverting();

    this.eventCenter.dispatch('reverting', {});

    const results = await Promise.all(
      /**
       * 如果 nextIndex 为 -1，则找到 index 为 0 的 node，
       * 因为它存在的 areas 就是变化量的 areas，对应的 state
       * 我们取对应的 initialState
       */
      Object.keys(
        // 本次移动 recover 的范围从上次剩余错误中继续
        currentNode.areasRecoverErrors?.errors ??
          (direction === 'forward' ? movedNode : currentNode)
            .changedAreasSnapshots,
      ).map((areaName) => {
        const meta = movedNode.areasSnapshots[areaName];
        return this.areas[areaName]
          .recover({
            state: meta.state,
            commitInfo: meta?.commitInfo,
            areaName,
            index: movedIndex,
            currentNode: movedNode,
            prevNode: movedPrevNode,
            nextNode: movedNextNode,
            offset,
            direction,
          })
          .then((result) => {
            return {
              areaName,
              result,
            };
          });
      }),
    );

    if (results.some((item) => item.result.success === false)) {
      const falses = results.filter((item) => item.result.success === false);

      /**
       * 每次到这里都重置错误项目
       * 因为 recover 是从上次错误项范围开始的
       */
      currentNode.areasRecoverErrors = {
        direction,
        errors: {},
      };

      falses.forEach((item) => {
        currentNode.areasRecoverErrors!.errors[item.areaName] = {
          message: item.result.errorMessage ?? '',
        };
      });

      this.stopReverting();

      this.eventCenter.dispatch('reverted', {
        data: false,
      });

      this.dropAllRevertQueue();

      return false;
    } else {
      currentNode.areasRecoverErrors = undefined;

      this.index = movedIndex;

      if (this.moveQueue.length) {
        this.nextRevert();
      } else {
        this.stopReverting();

        this.eventCenter.dispatch('reverted', {
          data: true,
        });
      }

      this.eventCenter.dispatch('updated', {
        data: this.getUpdateEventData(),
      });

      return true;
    }
  };

  private getUpdateEventData = () => {
    return {
      index: this.index,
      snapshotsStack: this.snapshotsStack,
    };
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
