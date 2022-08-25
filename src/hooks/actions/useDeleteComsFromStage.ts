import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useDeleteComsFromStage = () => {
  const { setStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    setStageSelectNodeId: model.setStageSelectNodeId,
  }));

  const { deleteComModelByIds } = useModel('stage.comsStructures', (model) => {
    return {
      deleteComModelByIds: model.deleteComModelByIds,
    };
  });

  const { deleteComStatuslByIds } = useModel('stage.comsStatus', (model) => {
    return {
      deleteComStatuslByIds: model.deleteComStatuslByIds,
    };
  });

  const { deleteComSettingsDefaultslByIds } = useModel(
    'stage.statusSettingsDefaults',
    (model) => {
      return {
        deleteComSettingsDefaultslByIds: model.deleteComSettingsDefaultslByIds,
      };
    },
  );

  const { deleteComsStatusRelationslByIds } = useModel(
    'stage.statusConnectRelations',
    (model) => {
      return {
        deleteComsStatusRelationslByIds: model.deleteComsStatusRelationslByIds,
      };
    },
  );

  const { deleteComsActionsByIds } = useModel('stage.comsActions', (model) => {
    return {
      deleteComsActionsByIds: model.deleteComsActionsByIds,
    };
  });

  const { deleteComsEventsByIds } = useModel('stage.comsEvents', (model) => {
    return {
      deleteComsEventsByIds: model.deleteComsEventsByIds,
    };
  });

  const { deleteComsStylesByIds } = useModel('stage.comsStyles', (model) => {
    return {
      deleteComsStylesByIds: model.deleteComsStylesByIds,
    };
  });

  const { deleteComsSettingsByIds } = useModel('stage.comsSettings', (model) => {
    return {
      deleteComsSettingsByIds: model.deleteComsSettingsByIds,
    };
  });

  const deleteComsFromStage = useMemoizedFn((comIds: string[]) => {
    deleteComModelByIds(comIds);
    deleteComStatuslByIds(comIds);
    deleteComSettingsDefaultslByIds(comIds);
    deleteComsStatusRelationslByIds(comIds);
    deleteComsActionsByIds(comIds);
    deleteComsEventsByIds(comIds);
    deleteComsStylesByIds(comIds);
    deleteComsSettingsByIds(comIds);
    setStageSelectNodeId((prev) => {
      if (prev && comIds.includes(prev)) {
        return undefined;
      }
      return prev;
    });
  });

  return {
    deleteComsFromStage,
  };
};
