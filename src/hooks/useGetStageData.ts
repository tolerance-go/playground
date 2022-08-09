import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useGetStageData = () => {
  const { getData: getComsTreeData } = useModel(
    'stageComponentsModel',
    (model) => {
      return {
        getData: model.getData,
      };
    },
  );

  const { getData: getStatusSettings } = useModel('comsStatus', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getStatusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => {
      return {
        getData: model.getData,
      };
    },
  );

  const { getData: getStatusRelations } = useModel(
    'statusRelations',
    (model) => {
      return {
        getData: model.getData,
      };
    },
  );

  const { getData: getComsActions } = useModel('comsActions', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getComsEvents } = useModel('comsEvents', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getComsStyles } = useModel('comsStyles', (model) => {
    return {
      getData: model.getData,
    };
  });

  const { getData: getComsSettings } = useModel('comsSettings', (model) => {
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
