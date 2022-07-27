import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useSetNearSelectedComponentStatusId = () => {
  const { getLatestComponentsStatus } = useModel('statusSettings', (model) => ({
    getLatestComponentsStatus: model.getLatestComponentsStatus,
  }));

  const { getStageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  const { setSelectedComponentStatusId, getSelectedComponentStatusId } =
    useModel('selectedComponentStatusId', (model) => ({
      setSelectedComponentStatusId: model.setSelectedComponentStatusId,
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }));

  /** 将选中 id 设置为旁边的 id */
  const setNearSelectedComponentStatusId = useMemoizedFn(() => {
    const stageSelectNodeId = getStageSelectNodeId();
    if (stageSelectNodeId) {
      const componentsStatus = getLatestComponentsStatus();
      const selectedComponentStatusId = getSelectedComponentStatusId();
      const keys = Object.keys(componentsStatus[stageSelectNodeId]);
      const index = keys.findIndex(
        (item) => item === selectedComponentStatusId,
      );
      if (index > 0) {
        setSelectedComponentStatusId(keys[index - 1]);
      } else {
        setSelectedComponentStatusId(undefined);
      }
    }
  });

  return {
    setNearSelectedComponentStatusId,
  };
};
