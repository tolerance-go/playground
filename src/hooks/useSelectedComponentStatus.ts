import { useModel } from '@umijs/max';

/** 获取当前选中组件的所有配置状态 */
export const useSelectedComponentStatus = () => {
  const { componentsStatus } = useModel('statusSettings', (model) => {
    return {
      componentsStatus: model.componentsStatus,
    };
  });

  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  if (stageSelectNodeId) {
    return { status: componentsStatus[stageSelectNodeId] };
  }

  return {
    status: undefined,
  };
};
