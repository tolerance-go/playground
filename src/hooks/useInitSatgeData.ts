import { PageControllerShow } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useInitSatgeData = () => {
  const { initData: initComsTreeData } = useModel(
    'stageComponentsModel',
    (model) => ({
      initData: model?.initData,
    }),
  );

  // const { initData: initComsSettingsData } = useModel(
  //   'comsActiveSettings',
  //   (model) => ({
  //     initData: model?.initData,
  //   }),
  // );

  const { initData: initStatusSettings } = useModel(
    'statusSettings',
    (model) => ({
      initData: model?.initData,
    }),
  );

  const { initData: initStatusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => ({
      initData: model?.initData,
    }),
  );

  const { initData: initStatusRelations } = useModel(
    'statusRelations',
    (model) => {
      return {
        initData: model?.initData,
      };
    },
  );

  const { initData: initComsActions } = useModel('comsActions', (model) => {
    return {
      initData: model?.initData,
    };
  });

  const { initData: initComsEvents } = useModel('comsEvents', (model) => {
    return {
      initData: model?.initData,
    };
  });

  const initStageData = useMemoizedFn(async (activePageId: string) => {
    const { success, data } = await PageControllerShow({
      id: activePageId,
    });

    const stageData = data?.stage_data ? JSON.parse(data?.stage_data) : {};

    if (success) {
      initComsTreeData(stageData.comsTree);
      // initComsSettingsData(stageData.comsModel);
      initStatusSettings(stageData.comsStatus);
      initStatusSettingsDefaults(stageData.comsStatusDefaults);
      initStatusRelations(stageData.comsStatusRelations);
      initComsActions(stageData.comsActions);
      initComsEvents(stageData.comsEvents);
    }
  });

  return {
    initStageData,
  };
};
