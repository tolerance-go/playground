import { message } from 'antd';
import { nanoid } from 'nanoid';
import { EventManager } from './EventManager';

export type AreaName = string;

export type RecoverParams<S = any, C = any> = {
  index: number;
  state: S;
  commitInfo: C;
  areaName: string;
  currentNode: SnapshotsNode<S, C>;
  snapshotsStack: SnapshotsNode<S, C>[];
  prevNode?: SnapshotsNode<S, C>;
  nextNode?: SnapshotsNode<S, C>;
  direction: 'back' | 'forward' | 'stand';
  offset: number;
};

export type RecoverResult = {
  success: boolean;
  errorMessage?: string;
};

export type HistoryUpdateDataType = {
  index: number;
  snapshotsStack: SnapshotsNode[];
};

export type HistoryAreaInitParams<S = any, C = any> = {
  name: string;
  pull: () => any;
  recover: (opts: RecoverParams<S, C>) => Promise<RecoverResult>;
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
  createTime: number;
  changedAreasSnapshots: Record<
    string,
    {
      commitInfo: C;
    }
  >;
  areasSnapshots: Record<
    string,
    {
      state: S;
    }
  >;
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
  static VirtualInitialNodeId = 'virtualInitialNode';

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

  private initialNodeAreasInfos: Record<
    string,
    {
      commitInfo: any;
      state: any;
    }
  > = {};

  private inited: boolean = false;

  /**
   * areas 停车位
   * 只在初始化时，注册的 areas 停车位全部“停满”，才允许“发车”，发送 inted 事件
   */
  private areasParkingSpace: Record<AreaName, boolean> = {};

  constructor(areasParkingSpace: AreaName[]) {
    this.areasParkingSpace = areasParkingSpace.reduce((acc, areaName) => {
      return {
        ...acc,
        [areaName]: false,
      };
    }, {});
  }

  /**
   * revert 队列，等待上一个 revert 结束会自动
   * 检索该队列
   */
  private moveQueue: {
    createTime: number;
    offset: 1 | -1 | 0;
  }[] = [];

  /** 注册区域 */
  public registerArea<S = any, C = any>(params: HistoryAreaInitParams<S, C>) {
    console.warn('area name is repeated');

    const area = new HistoryArea(params);
    this.areas[area.name] = area;

    /** 初始化的时候，所有都作为初始化 */
    this.initialNodeAreasInfos[area.name] = {
      state: area.getInitialState(),
      commitInfo: {
        type: 'registerArea',
      },
    };

    this.areasParkingSpace[params.name] = true;

    if (this.areasParkingSpaceIsReady()) {
      if (this.inited) {
        this.eventCenter.dispatch('inited', this.getUpdateEventData());
      }
      if (this.snapshotsStack.length === 0) {
        this.commit(
          this.initialNodeAreasInfos,
          HistoryManager.VirtualInitialNodeId,
        );
      }
    }
  }

  /** 初始化快照数据 */
  public init({
    snapshotsStack,
    index,
  }: {
    snapshotsStack?: SnapshotsNode[];
    index?: number;
  }) {
    this.snapshotsStack = snapshotsStack ?? this.snapshotsStack;
    this.index = index ?? this.index;

    this.inited = true;

    if (this.areasParkingSpaceIsReady()) {
      this.eventCenter.dispatch('inited', this.getUpdateEventData());
    }
  }

  /** 清空历史记录 */
  public clean() {
    this.snapshotsStack = [];
    this.index = -1;

    this.eventCenter.dispatch('updated', this.getUpdateEventData());
  }

  /** 栈顶部增加一个快照节点 */
  public commit(
    infos: Record<
      string,
      {
        commitInfo: any;
        state: any;
      }
    >,
    customId?: string,
  ) {
    /**
     * 如果当前 index 在中间位置，新增 commit 前要丢弃后面的 commit
     * @TODO 增加异步同步
     */
    if (this.index < this.snapshotsStack.length - 1) {
      this.snapshotsStack = this.snapshotsStack.slice(0, this.index + 1);
    }

    const commitId = customId ?? nanoid();
    const node = Object.keys(infos).reduce(
      (acc, areaName) => {
        return {
          ...acc,
          changedAreasSnapshots: {
            ...acc.changedAreasSnapshots,
            [areaName]: {
              commitInfo: infos[areaName].commitInfo,
            },
          },
          /** 这里注意对全量快照进行覆盖，因为 pull 可能拉到的是老的数据 */
          areasSnapshots: {
            ...acc.areasSnapshots,
            [areaName]: {
              state: infos[areaName].state,
            },
          },
        };
      },
      {
        id: commitId,
        createTime: new Date().getTime(),
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

    this.eventCenter.dispatch('updated', this.getUpdateEventData());
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
  public listen<D = any>(type: string, handler: (event: { data: D }) => void) {
    return this.eventCenter.listen<D>(type, handler);
  }

  /** 解除监听 */
  public unlisten(type: string, handerId: string) {
    this.eventCenter.unlisten(type, handerId);
  }

  /** 移动到某个 commit */
  public move(offset: -1 | 1 | 0) {
    const nextIndex = this.getNextIndex(offset);
    if (nextIndex < 0 || nextIndex > this.snapshotsStack.length - 1) {
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
    const currentNode = this.snapshotsStack[this.index];

    /**
     * 如果快照数量为 1，并且 offset 为 -1
     * 那么退回的状态为空状态
     */
    const movedIndex = this.getNextIndex(offset);
    const movedNode = this.snapshotsStack[movedIndex];
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
        return this.areas[areaName]?.recover({
            state: meta.state,
            commitInfo: movedNode.changedAreasSnapshots[areaName]?.commitInfo,
            areaName,
            index: movedIndex,
            currentNode: movedNode,
            prevNode: movedPrevNode,
            nextNode: movedNextNode,
            offset,
            direction,
            snapshotsStack: this.snapshotsStack,
          })
          .then((result) => {
            return {
              areaName,
              result,
            };
          });
      }),
    );

    if (results.some((item) => item?.result.success === false)) {
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

      this.eventCenter.dispatch('reverted', false);

      this.dropAllRevertQueue();

      return false;
    } else {
      currentNode.areasRecoverErrors = undefined;

      this.index = movedIndex;

      if (this.moveQueue.length) {
        this.nextRevert();
      } else {
        this.stopReverting();

        this.eventCenter.dispatch('reverted', true);
      }

      this.eventCenter.dispatch('updated', this.getUpdateEventData());

      return true;
    }
  };

  private getUpdateEventData = (): HistoryUpdateDataType => {
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

  private areasParkingSpaceIsReady() {
    return Object.keys(this.areasParkingSpace).every(
      (areaName) => this.areasParkingSpace[areaName] === true,
    );
  }
}
