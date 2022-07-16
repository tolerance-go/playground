import { PageControllerShow } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useInitSatgeData = () => {
  const { initData: initComsTreeData } = useModel(
    'stageComponentsModel',
    (model) => ({
      initData: model.initData,
    }),
  );

  const { initData: initComsSettingsData } = useModel(
    'componentsSettings',
    (model) => ({
      initData: model.initData,
    }),
  );

  const initStageData = useMemoizedFn(async (activePageId: string) => {
    const { success, data } = await PageControllerShow({
      id: activePageId,
    });

    const stageData = data?.stage_data ? JSON.parse(data?.stage_data) : {};

    if (success) {
      initComsTreeData(stageData.comsTree);
      initComsSettingsData(stageData.comsModel);
    }
  });

  return {
    initStageData,
  };
};
