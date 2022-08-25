import { ActionId, ComId, StatId } from '@/typings/keys';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { setComStatTypeWithName } from '@/models/_utils/setComStatTypeWithName';
import { updateComStatTypeWithName } from '@/models/_utils/updateComStatTypeWithName';
import { useCopyComPropsFromStatToOtherStat } from '@/models/_utils/useCopyComPropsFromStatToOtherStat';
import utl from 'lodash';

/**
 * eg：
 * 1. 按钮发送请求
 * 2. 切换其他状态
 */
export type ComponentAction = {
  id: string;
  type: string;
  settings: object;
  name: string;
  typeZh: string;
};

/** key: actionId */
export type ComponentActions = Record<ActionId, ComponentAction>;

/**
 * 组件的不同状态
 * key: statId
 */
export type ComponentStatusActions = Record<StatId, ComponentActions>;

/**
 * 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsActions = Record<ComId, ComponentStatusActions>;

/** 组件的动作 */
const useComsActions = () => {
  const [comsActions, setComsActions] = useState<ComponentsActions>({});

  const { getSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  /** 创建新的动作 */
  const createComStatAction = useMemoizedFn(
    (comId: string, statId: string, action: Omit<ComponentAction, 'id'>) => {
      setComsActions(
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
            ...action,
          };
        }),
      );
    },
  );

  const setComStatAction = useMemoizedFn(
    (comId: string, statId: string, action: ComponentAction) => {
      setComsActions(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][statId][action.id] = action;
        }),
      );
    },
  );

  const setComStatActionWithName = useMemoizedFn(
    (
      comId: string,
      statId: string,
      actionWithName: {
        [actionName: string]: ComponentAction;
      },
    ) => {
      setComsActions(
        produce((draft) => {
          setComStatTypeWithName(comId, statId, actionWithName, draft);
        }),
      );
    },
  );

  /** 通过 name 作为 key 找到并更新 */
  const updateComStatActionWithName = useMemoizedFn(
    (
      comId: string,
      statId: string,
      actionWithName: Partial<{
        [actionName: string]: ComponentAction;
      }>,
    ) => {
      setComsActions(
        produce((draft) => {
          updateComStatTypeWithName(comId, statId, actionWithName, draft);
        }),
      );
    },
  );

  /** 更新动作 */
  const updateComStatAction = useMemoizedFn(
    (
      comId: string,
      statId: string,
      action: Omit<Partial<ComponentAction>, 'id'> &
        Pick<ComponentAction, 'id'>,
    ) => {
      setComsActions(
        produce((draft) => {
          draft[comId][statId][action.id] = {
            ...draft[comId][statId][action.id],
            ...action,
          };
        }),
      );
    },
  );

  /** 删除动作 */
  const deleteComStatAction = useMemoizedFn(
    (comId: string, statId: string, actionId: string) => {
      setComsActions(
        produce((draft) => {
          delete draft[comId][statId][actionId];
        }),
      );
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsActions,
    };
  });

  const getSliceData = useMemoizedFn((comIds: string[]) => {
    return {
      comsActions: utl.pick(comsActions, comIds),
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { comsActions: ComponentsActions }) => {
      setComsActions(from?.comsActions ?? {});
    },
  );

  /** 获取指定组件的状态下的动作 */
  const getComStatActions = useMemoizedFn((comId: string, statId: string) => {
    return comsActions[comId]?.[statId];
  });

  /** 获取指定组件的状态下的动作 */
  const getComStatAction = useMemoizedFn(
    (comId: string, statId: string, actionId: string) => {
      return comsActions[comId]?.[statId]?.[actionId];
    },
  );

  /** 拷贝组件 A 状态的配置到 B 状态 */
  const { copyComPropsFromStatToOtherStat: copyComActionFromStatToOtherStat } =
    useCopyComPropsFromStatToOtherStat(setComsActions);

  const copySelectedComActionFromActiveStatToOtherStat = useMemoizedFn(
    (toStatId: string) => {
      const stageSelectNodeId = getStageSelectNodeId();
      const selectedComponentStatusId = getSelectedComponentStatusId();
      if (stageSelectNodeId && selectedComponentStatusId) {
        copyComActionFromStatToOtherStat(
          stageSelectNodeId,
          selectedComponentStatusId,
          toStatId,
        );
      }
    },
  );


  const deleteComsActionsByIds = useMemoizedFn((comIds: string[]) => {
    setComsActions(
      produce((draft) => {
        comIds.forEach((comId) => {
          delete draft[comId];
        });
      }),
    );
  });

  return {
    comsActions,
    deleteComsActionsByIds,
    getSliceData,
    setComStatAction,
    setComStatActionWithName,
    updateComStatActionWithName,
    copySelectedComActionFromActiveStatToOtherStat,
    copyComActionFromStatToOtherStat,
    getComStatAction,
    getComStatActions,
    deleteComStatAction,
    updateComStatAction,
    createComStatAction,
    getData,
    initData,
  };
};

export default useComsActions;
