import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useInitSatgeData = () => {
  const { initData: initComsTreeData } = useModel(
    'stage.comsStructures',
    (model) => ({
      initData: model.initData,
    }),
  );

  const { initData: initStatusSettings } = useModel('stage.comsStatus', (model) => ({
    initData: model.initData,
  }));

  const { initData: initStatusSettingsDefaults } = useModel(
    'stage.statusSettingsDefaults',
    (model) => ({
      initData: model.initData,
    }),
  );

  const { initData: initStatusRelations } = useModel(
    'stage.statusConnectRelations',
    (model) => {
      return {
        initData: model.initData,
      };
    },
  );

  const { initData: initComsActions } = useModel('stage.comsActions', (model) => {
    return {
      initData: model.initData,
    };
  });

  const { initData: initComsEvents } = useModel('stage.comsEvents', (model) => {
    return {
      initData: model.initData,
    };
  });

  const { initData: initComsStyles } = useModel('stage.comsStyles', (model) => {
    return {
      initData: model.initData,
    };
  });

  const { initData: initComsSettings } = useModel('stage.comsSettings', (model) => {
    return {
      initData: model.initData,
    };
  });

  const initStageData = useMemoizedFn(
    async (stageData: Record<string, any>) => {
      initComsTreeData(stageData.comsTree);
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
