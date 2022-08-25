import { useModel } from '@umijs/max';
import { useMemo } from 'react';

/** 获取当前组件状态的继承状态对象 */
export const useSelectedComActiveStatExtendRelation = () => {
  const { selectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const { comsStatusRelations } = useModel('page.statusConnectRelations', (model) => ({
    comsStatusRelations: model.comsStatusRelations,
  }));

  const extendRelation = useMemo(() => {
    if (stageSelectNodeId) {
      const relations = Object.keys(
        comsStatusRelations[stageSelectNodeId] ?? {},
      ).map((relationId) => comsStatusRelations[stageSelectNodeId][relationId]);

      const extendRelation = relations.find(
        (relation) => relation.toId === selectedComponentStatusId,
      );

      return extendRelation;
    }
    return undefined;
  }, [stageSelectNodeId, comsStatusRelations, selectedComponentStatusId]);

  return {
    extendRelation,
  };
};
