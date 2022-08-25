import { ComponentStructure } from '@/models/page/comsStructures';
import { useModel } from '@umijs/max';
import { useMemo } from 'react';

export const useSelectedNode = () => {
  const { stageComponentsModel } = useModel(
    'page.comsStructures',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
    }),
  );

  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const stageSelectNode: ComponentStructure | undefined = useMemo(() => {
    if (stageSelectNodeId) {
      return stageComponentsModel?.[stageSelectNodeId];
    }
    return undefined;
  }, [stageSelectNodeId, stageComponentsModel]);

  return {
    stageSelectNode,
  };
};
