import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { nanoid } from 'nanoid';
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

  const { getStageSelectNodeId } = useModel('stageSelectNode', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

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

  return {
    componentsStatus,
    setComponentsStatus,
    createComponentStatusFromNow,
  };
};

export default useStatusSettings;
