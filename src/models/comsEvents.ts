import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';

/**
 * eg：
 * 1. 按钮发送请求
 * 2. 切换其他状态
 */
export type ComponentEvent = {
  id: string;
  type: string;
  settings: object;
  name: string;
  typeZh: string;
  // 触发条件
  triggerConditionId?: string;
  // 执行条件
  execConditionId?: string;
  execComId: string;
  execComStatId: string;
  execComStatActionId: string;
};

/** key: EventId */
export type ComponentEvents = Record<string, ComponentEvent>;

/**
 * 组件的不同状态
 * key: statId
 */
export type ComponentStatusEvents = Record<string, ComponentEvents>;

/** 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsEvents = Record<string, ComponentStatusEvents>;

/** 组件的事件管理 */
const useComsEvents = () => {
  const [comsEvents, setComsEvents] = useState<ComponentsEvents>({});

  /** 创建新的动作 */
  const createComStatEvent = useMemoizedFn(
    (comId: string, statId: string, event: Omit<ComponentEvent, 'id'>) => {
      setComsEvents(
        produce((draft) => {
          const newId = nanoid();

          if (draft[comId] === undefined) {
            draft[comId] = {};
          }

          if (draft[comId][statId] === undefined) {
            draft[comId][statId] = {};
          }

          draft[comId][statId][newId] = {
            id: newId,
            ...event,
          };
        }),
      );
    },
  );

  /** 更新动作 */
  const updateComStatEvent = useMemoizedFn(
    (
      comId: string,
      statId: string,
      event: Partial<ComponentEvent> & Pick<ComponentEvent, 'id'>,
    ) => {
      setComsEvents(
        produce((draft) => {
          draft[comId][statId][event.id] = {
            ...draft[comId][statId][event.id],
            ...event,
          };
        }),
      );
    },
  );

  /** 删除动作 */
  const deleteComStatEvent = useMemoizedFn(
    (comId: string, statId: string, eventId: string) => {
      setComsEvents(
        produce((draft) => {
          delete draft[comId][statId][eventId];
        }),
      );
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsEvents,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn((from?: { comsEvents: ComponentsEvents }) => {
    setComsEvents(from?.comsEvents ?? {});
  });

  return {
    comsEvents,
    createComStatEvent,
    setComsEvents,
    updateComStatEvent,
    deleteComStatEvent,
    getData,
    initData,
  };
};

export default useComsEvents;
