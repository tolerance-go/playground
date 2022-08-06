import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

/** 获取当前选中组件的所有配置状态 */
export const useSelectedComponentStatus = () => {
  const { componentsStatus, getComponentsStatus } = useModel(
    'comsStatus',
    (model) => {
      return {
        componentsStatus: model.componentsStatus,
        getComponentsStatus: model.getComponentsStatus,
      };
    },
  );

  const { stageSelectNodeId, getStageSelectNodeId } = useModel(
    'stageSelectNodeId',
    (model) => ({
      stageSelectNodeId: model.stageSelectNodeId,
      getStageSelectNodeId: model.getStageSelectNodeId,
    }),
  );

  const getSelectedComStatus = useMemoizedFn(() => {
    const componentsStatus = getComponentsStatus();
    const stageSelectNodeId = getStageSelectNodeId();

    if (stageSelectNodeId) {
      return componentsStatus[stageSelectNodeId];
    }
    return undefined;
  });

  if (stageSelectNodeId) {
    return {
      getSelectedComStatus,
      status: componentsStatus[stageSelectNodeId],
    };
  }

  return {
    getSelectedComStatus,
    status: undefined,
  };
};
