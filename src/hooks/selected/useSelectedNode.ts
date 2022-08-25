import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import { useMemo } from 'react';

export const useSelectedNode = () => {
  const { stageComponentsModel } = useModel(
    'stage.comsStructures',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
    }),
  );

  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const stageSelectNode: StageComponentsModelItem | undefined = useMemo(() => {
    if (stageSelectNodeId) {
      return stageComponentsModel?.[stageSelectNodeId];
    }
    return undefined;
  }, [stageSelectNodeId, stageComponentsModel]);

  return {
    stageSelectNode,
  };
};
