import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useGetSliceStageData = () => {
  const { getSliceData: getComsTreeData } = useModel(
    'stage.comsStructures',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getStatusSettings } = useModel(
    'stage.comsStatus',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getStatusSettingsDefaults } = useModel(
    'stage.statusSettingsDefaults',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getStatusRelations } = useModel(
    'stage.statusConnectRelations',
    (model) => {
      return {
        getSliceData: model.getSliceData,
      };
    },
  );

  const { getSliceData: getComsActions } = useModel('stage.comsActions', (model) => {
    return {
      getSliceData: model.getSliceData,
    };
  });

  const { getSliceData: getComsEvents } = useModel('stage.comsEvents', (model) => {
    return {
      getSliceData: model.getSliceData,
    };
  });

  const { getSliceData: getComsStyles } = useModel('stage.comsStyles', (model) => {
    return {
      getSliceData: model.getSliceData,
    };
  });

  const { getSliceData: getComsSettings } = useModel(
    'stage.comsSettings',
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
