import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useGetSliceStageData = () => {
  const { getSliceData: getComsTreeData } = useModel(
    'stageComponentsModel',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getStatusSettings } = useModel(
    'comsStatus',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getStatusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getStatusRelations } = useModel(
    'statusRelations',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getComsActions } = useModel('comsActions', (model) => {
    return {
      getSliceData: model.getSliceData,
    };
  });

  const { getSliceData: getComsEvents } = useModel('comsEvents', (model) => {
    return {
      getSliceData: model.getSliceData,
    };
  });

  const { getSliceData: getComsStyles } = useModel('comsStyles', (model) => {
    return {
      getSliceData: model.getSliceData,
    };
  });

  const { getSliceData: getComsSettings } = useModel(
    'comsSettings',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const getSliceStageData = useMemoizedFn((comIds: string[]) => {
    const comsTree = getComsTreeData(comIds);
    const allComIds = Object.keys(comsTree.stageComponentsModel ?? {});
    return {
      comsTree,
      comsStatusRelations: getStatusRelations(allComIds),
      comsStatus: getStatusSettings(allComIds),
      comsStatusDefaults: getStatusSettingsDefaults(allComIds),
      comsActions: getComsActions(allComIds),
      comsEvents: getComsEvents(allComIds),
      comsStyles: getComsStyles(allComIds),
      comsSettings: getComsSettings(allComIds),
    };
  });

  return {
    getSliceStageData,
  };
};
