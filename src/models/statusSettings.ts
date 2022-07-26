import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { DEFAULT_COM_STATUS_NAME } from './../constants/index';
// /** 所有组件的所有状态下配置之间的关系 */
// type ComsSettingsStatusRelation = Record<
//   string,
//   Record<
//     string,
//     {
//       toStatus: string;
//       fromStatus: string;
//       syncFields: Record<string, boolean>;
//     }
//   >
// >;
import { useState } from 'react';

/** 单个组件的配置 */
type ComponentConfigs = {
  settings: object;
  actions: object;
  styles: object;
};

/** 组件的不同状态 */
type ComponentStatus = Record<
  string,
  {
    id: string;
    name: string;
    configs: ComponentConfigs;
  }
>;

/** 所有组件的所有状态下的配置 */
type ComponentsStatus = Record<string, ComponentStatus>;

const useStatusSettings = () => {
  const [componentsStatus, setComponentsStatus] = useState<ComponentsStatus>(
    {},
  );

  const { getSelectedComponentStatusId } = useModel(
    'selectedComponentStatus',
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

  /** 从当前选中组件，创建新的配置状态 */
  const createComponentStatusFromNow = useMemoizedFn((name: string) => {
    setComponentsStatus(
      produce((draft) => {
        const selectedComponentStatusId = getSelectedComponentStatusId();
        const stageSelectNodeId = getStageSelectNodeId();

        if (selectedComponentStatusId && stageSelectNodeId) {
          const current = draft[selectedComponentStatusId][stageSelectNodeId];

          const newId = nanoid();

          draft[selectedComponentStatusId] = {
            ...draft[selectedComponentStatusId],
            [newId]: {
              id: newId,
              configs: current.configs,
              name,
            },
          };
        }
      }),
    );
  });

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
  const setComSettingsInCurrent = useMemoizedFn((settings: object) => {
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
    setComSettingsInCurrent,
    deleteComStatus,
    getData,
    initData,
    getLatestComponentsStatus,
    initComStatus,
    setComponentsStatus,
    createComponentStatusFromNow,
  };
};

export default useStatusSettings;
