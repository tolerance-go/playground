import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useDeleteComsFromStage = () => {
  const { deleteComModelByIds } = useModel('stageComponentsModel', (model) => {
    return {
      deleteComModelByIds: model.deleteComModelByIds,
    };
  });

  const { deleteComStatuslByIds } = useModel('comsStatus', (model) => {
    return {
      deleteComStatuslByIds: model.deleteComStatuslByIds,
    };
  });

  const { deleteComSettingsDefaultslByIds } = useModel(
    'statusSettingsDefaults',
    (model) => {
      return {
        deleteComSettingsDefaultslByIds: model.deleteComSettingsDefaultslByIds,
      };
    },
  );

  const { deleteComsStatusRelationslByIds } = useModel(
    'statusRelations',
    (model) => {
      return {
        deleteComsStatusRelationslByIds: model.deleteComsStatusRelationslByIds,
      };
    },
  );

  const { deleteComsActionsByIds } = useModel('comsActions', (model) => {
    return {
      deleteComsActionsByIds: model.deleteComsActionsByIds,
    };
  });

  const { deleteComsEventsByIds } = useModel('comsEvents', (model) => {
    return {
      deleteComsEventsByIds: model.deleteComsEventsByIds,
    };
  });

  const { deleteComsStylesByIds } = useModel('comsStyles', (model) => {
    return {
      deleteComsStylesByIds: model.deleteComsStylesByIds,
    };
  });

  const { deleteComsSettingsByIds } = useModel('comsSettings', (model) => {
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
  });

  return {
    deleteComsFromStage,
  };
};
