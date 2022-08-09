import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useInitSatgeData = () => {
  const { initData: initComsTreeData } = useModel(
    'stageComponentsModel',
    (model) => ({
      initData: model.initData,
    }),
  );

  const { initData: initStatusSettings } = useModel('comsStatus', (model) => ({
    initData: model.initData,
  }));

  const { initData: initStatusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => ({
      initData: model.initData,
    }),
  );

  const { initData: initStatusRelations } = useModel(
    'statusRelations',
    (model) => {
      return {
        initData: model.initData,
      };
    },
  );

  const { initData: initComsActions } = useModel('comsActions', (model) => {
    return {
      initData: model.initData,
    };
  });

  const { initData: initComsEvents } = useModel('comsEvents', (model) => {
    return {
      initData: model.initData,
    };
  });

  const { initData: initComsStyles } = useModel('comsStyles', (model) => {
    return {
      initData: model.initData,
    };
  });

  const { initData: initComsSettings } = useModel('comsSettings', (model) => {
    return {
      initData: model.initData,
    };
  });

  const initStageData = useMemoizedFn(
    async (stageData: Record<string, any>) => {
      initComsTreeData(stageData.comsTree);
      // initComsSettingsData(stageData.comsModel);
      initComsSettings(stageData.comsSettings);
      initStatusSettings(stageData.comsStatus);
      initStatusSettingsDefaults(stageData.comsStatusDefaults);
      initStatusRelations(stageData.comsStatusRelations);
      initComsActions(stageData.comsActions);
      initComsEvents(stageData.comsEvents);
      initComsStyles(stageData.comsStyles);
    },
  );

  return {
    initStageData,
  };
};
