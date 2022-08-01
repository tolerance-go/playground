import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { DEFAULT_COM_STATUS_NAME } from './../constants/index';

import { useState } from 'react';

/** 单个组件的配置 */
export type ComponentConfigs = {
  settings: object;
  actions: object;
  styles: object;
};

/** 组件状态 */
export type ComponentStat = {
  id: string;
  name: string;
  configs: ComponentConfigs;
};

/** 组件的不同状态 */
export type ComponentStatus = Record<string, ComponentStat>;

/** 所有组件的所有状态下的配置 */
export type ComponentsStatus = Record<string, ComponentStatus>;

const useStatusSettings = () => {
  const [componentsStatus, setComponentsStatus] = useState<ComponentsStatus>(
    {},
  );

  const { getSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  /** 删除组件的所有状态 */
  const deleteComStatus = useMemoizedFn((comId: string) => {
    setComponentsStatus(
      produce((draft) => {
        delete draft[comId];
      }),
    );
  });

  /** 删除组件的某个状态 */
  const deleteComStat = useMemoizedFn((comId: string, statId: string) => {
    setComponentsStatus(
      produce((draft) => {
        delete draft[comId][statId];
      }),
    );
  });

  /** 从当前选中组件，创建新的配置状态 */
  const createComponentStatusFromNow = useMemoizedFn(
    (newStatId: string, name: string) => {
      setComponentsStatus(
        produce((draft) => {
          const selectedComponentStatusId = getSelectedComponentStatusId();
          const stageSelectNodeId = getStageSelectNodeId();

          if (selectedComponentStatusId && stageSelectNodeId) {
            const current = draft[stageSelectNodeId][selectedComponentStatusId];

            draft[stageSelectNodeId] = {
              ...draft[stageSelectNodeId],
              [newStatId]: {
                id: newStatId,
                configs: current.configs,
                name,
              },
            };
          }
        }),
      );
    },
  );

  /** 初始化组件的默认状态 */
  const initComStatus = useMemoizedFn(
    ({
      statusId,
      comId,
      configs,
    }: {
      statusId: string;
      comId: string;
      configs: ComponentConfigs;
    }) => {
      setComponentsStatus(
        produce((draft) => {
          draft[comId] = {
            [statusId]: {
              id: statusId,
              name: DEFAULT_COM_STATUS_NAME,
              configs,
            },
          };
        }),
      );
    },
  );

  /** 设置组件当前状态下的配置 */
  const setSelectedComSettings = useMemoizedFn((settings: object) => {
    const selectedComponentStatusId = getSelectedComponentStatusId();
    const stageSelectNodeId = getStageSelectNodeId();

    if (stageSelectNodeId && selectedComponentStatusId) {
      setComponentsStatus(
        produce((draft) => {
          draft[stageSelectNodeId][selectedComponentStatusId].configs.settings =
            settings;
        }),
      );
    }
  });

  /** 设置指定组件指定状态下的配置 */
  const setComStatSettings = useMemoizedFn(
    (comId: string, statId: string, settings: object) => {
      setComponentsStatus(
        produce((draft) => {
          if (draft[comId][statId]?.configs) {
            draft[comId][statId].configs.settings = settings;
          }
        }),
      );
    },
  );

  /** 部分设置指定组件指定状态下的配置 */
  const updateComStatSettings = useMemoizedFn(
    (comId: string, statId: string, settings: object) => {
      setComponentsStatus(
        produce((draft) => {
          if (draft[comId][statId]?.configs) {
            draft[comId][statId].configs.settings = {
              ...draft[comId][statId].configs.settings,
              ...settings,
            };
          }
        }),
      );
    },
  );

  /** 设置当前选中组件的激活 tab 的名称 */
  const setSelectedComActiveStatName = useMemoizedFn((name: string) => {
    const selectedComponentStatusId = getSelectedComponentStatusId();
    const stageSelectNodeId = getStageSelectNodeId();

    if (stageSelectNodeId && selectedComponentStatusId) {
      setComponentsStatus(
        produce((draft) => {
          draft[stageSelectNodeId][selectedComponentStatusId].name = name;
        }),
      );
    }
  });

  const getLatestComponentsStatus = useMemoizedFn(() => {
    return componentsStatus;
  });

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      componentsStatus,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { componentsStatus: ComponentsStatus }) => {
      setComponentsStatus(from?.componentsStatus ?? {});
    },
  );

  return {
    componentsStatus,
    updateComStatSettings,
    setSelectedComActiveStatName,
    setSelectedComSettings,
    setComStatSettings,
    deleteComStatus,
    deleteComStat,
    getData,
    initData,
    getLatestComponentsStatus,
    initComStatus,
    setComponentsStatus,
    createComponentStatusFromNow,
  };
};

export default useStatusSettings;
