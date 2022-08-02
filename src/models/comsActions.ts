import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';

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
export type ComponentActions = Record<string, ComponentAction>;

/** 组件的不同状态
 * key: statId
 */
export type ComponentStatusActions = Record<string, ComponentActions>;

/** 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsActions = Record<string, ComponentStatusActions>;

/** 组件的动作 */
const useComsActions = () => {
  const [comsActions, setComsActions] = useState<ComponentsActions>({});

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

  /** 更新动作 */
  const updateComStatAction = useMemoizedFn(
    (
      comId: string,
      statId: string,
      action: Partial<ComponentAction> & Pick<ComponentAction, 'id'>,
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

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { comsActions: ComponentsActions }) => {
      setComsActions(from?.comsActions ?? {});
    },
  );

  return {
    comsActions,
    deleteComStatAction,
    updateComStatAction,
    createComStatAction,
    getData,
    initData,
  };
};

export default useComsActions;