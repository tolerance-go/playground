import { ComId, EventId, StatId } from '@/typings/keys';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import utl from 'lodash';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { setComStatTypeWithName } from '@/models/_utils/setComStatTypeWithName';
import { updateComStatTypeWithName } from '@/models/_utils/updateComStatTypeWithName';
import { useCopyComPropsFromStatToOtherStat } from '@/models/_utils/useCopyComPropsFromStatToOtherStat';

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

  const { eventManager } = useModel('stage.eventManager', (model) => ({
    eventManager: model.eventManager,
  }));

  const { getSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
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

  const setComStatEventWithName = useMemoizedFn(
    (
      comId: string,
      statId: string,
      eventWithName: {
        [actionName: string]: ComponentEvent;
      },
    ) => {
      setComsEvents(
        produce((draft) => {
          setComStatTypeWithName(comId, statId, eventWithName, draft);
        }),
      );
    },
  );

  /** 通过 name 作为 key 找到并更新 */
  const updateComStatEventWithName = useMemoizedFn(
    (
      comId: string,
      statId: string,
      eventWithName: Partial<{
        [actionName: string]: ComponentEvent;
      }>,
    ) => {
      setComsEvents(
        produce((draft) => {
          updateComStatTypeWithName(comId, statId, eventWithName, draft);
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

  const getSliceData = useMemoizedFn((comIds: string[]) => {
    return {
      comsEvents: utl.pick(comsEvents, comIds),
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

  /** 拷贝组件 A 状态的配置到 B 状态 */
  const { copyComPropsFromStatToOtherStat: copyComEventFromStatToOtherStat } =
    useCopyComPropsFromStatToOtherStat(setComsEvents);

  const copySelectedComEventFromActiveStatToOtherStat = useMemoizedFn(
    (toStatId: string) => {
      const stageSelectNodeId = getStageSelectNodeId();
      const selectedComponentStatusId = getSelectedComponentStatusId();
      if (stageSelectNodeId && selectedComponentStatusId) {
        copyComEventFromStatToOtherStat(
          stageSelectNodeId,
          selectedComponentStatusId,
          toStatId,
        );
      }
    },
  );

  const deleteComsEventsByIds = useMemoizedFn((comIds: string[]) => {
    setComsEvents(
      produce((draft) => {
        comIds.forEach((comId) => {
          delete draft[comId];
        });
      }),
    );
  });

  return {
    comsEvents,
    deleteComsEventsByIds,
    setComStatEventWithName,
    updateComStatEventWithName,
    copySelectedComEventFromActiveStatToOtherStat,
    copyComEventFromStatToOtherStat,
    createComStatEvent,
    setComsEvents,
    updateComStatEvent,
    deleteComStatEvent,
    getData,
    initData,
    getSliceData,
  };
};

export default useComsEvents;
