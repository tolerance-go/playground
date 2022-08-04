import { ComId, EventId, StatId } from '@/typings/keys';
import { useModel } from '@umijs/max';
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
export type ComponentEvents = Record<EventId, ComponentEvent>;

/**
 * 组件的不同状态
 * key: statId
 */
export type ComponentStatusEvents = Record<StatId, ComponentEvents>;

/** 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsEvents = Record<ComId, ComponentStatusEvents>;

/** 组件的事件管理 */
const useComsEvents = () => {
  const [comsEvents, setComsEvents] = useState<ComponentsEvents>({});

  const { eventManager } = useModel('eventManager', (model) => ({
    eventManager: model.eventManager,
  }));

  /** 创建新的事件 */
  const createComStatEvent = useMemoizedFn(
    (comId: string, statId: string, event: Omit<ComponentEvent, 'id'>) => {
      const newId = nanoid();

      setComsEvents(
        produce((draft) => {
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

      /** 注册事件 */
      eventManager.register(comId, statId, {
        id: newId,
        type: event.type,
        settings: event.settings,
        execComId: event.execComId,
        execComStatId: event.execComStatId,
        execComStatActionId: event.execComStatActionId,
      });
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

      /** 更新注册 */
      eventManager.update(comId, statId, {
        id: event.id,
        type: event.type,
        settings: event.settings,
        execComId: event.execComId,
        execComStatId: event.execComStatId,
        execComStatActionId: event.execComStatActionId,
      });
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

      /** 卸载注册 */
      eventManager.uninstalled(comId, statId, eventId);
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

    /** 初始化注册事件管理 */
    if (from?.comsEvents) {
      Object.keys(from.comsEvents).forEach((comId) => {
        Object.keys(from.comsEvents[comId]).forEach((statId) => {
          const events = from.comsEvents[comId][statId];
          Object.keys(events).forEach((eventId) => {
            const event = events[eventId];
            eventManager.register(comId, statId, {
              id: event.id,
              type: event.type,
              settings: event.settings,
              execComId: event.execComId,
              execComStatId: event.execComStatId,
              execComStatActionId: event.execComStatActionId,
            });
          });
        });
      });
    }
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
