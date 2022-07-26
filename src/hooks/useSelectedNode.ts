import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import { useMemo } from 'react';

export const useSelectedNodeMeta = () => {
  const { stageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
    }),
  );

  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
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
