import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useGetStageData = () => {
  const { getData: getComsTreeData } = useModel(
    'stage.comsStructures',
    (model) => {
      return {
        getData: model.getData,
      };
    },
  );

  const { getData: getStatusSettings } = useModel('stage.comsStatus', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getStatusSettingsDefaults } = useModel(
    'stage.statusSettingsDefaults',
    (model) => {
      return {
        getData: model.getData,
      };
    },
  );

  const { getData: getStatusRelations } = useModel(
    'stage.statusConnectRelations',
    (model) => {
      return {
        getData: model.getData,
      };
    },
  );

  const { getData: getComsActions } = useModel('stage.comsActions', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getComsEvents } = useModel('stage.comsEvents', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getComsStyles } = useModel('stage.comsStyles', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getComsSettings } = useModel('stage.comsSettings', (model) => {
    return {
      getData: model.getData,
    };
  });

  const getStageData = useMemoizedFn(() => {
    return {
      comsStatusRelations: getStatusRelations(),
      comsTree: getComsTreeData(),
      // comsModel: getComsModelData(),
      comsStatus: getStatusSettings(),
      comsStatusDefaults: getStatusSettingsDefaults(),
      comsActions: getComsActions(),
      comsEvents: getComsEvents(),
      comsStyles: getComsStyles(),
      comsSettings: getComsSettings(),
    };
  });

  return {
    getStageData,
  };
};
