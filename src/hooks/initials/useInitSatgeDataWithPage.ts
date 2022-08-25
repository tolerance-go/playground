import { PageControllerShow } from '@/services/server/PageController';
import { useMemoizedFn } from 'ahooks';
import { useInitSatgeData } from './useInitStageData';

export const useInitSatgeDataWithPage = () => {
  const { initStageData } = useInitSatgeData();

  const initSatgeDataWithPage = useMemoizedFn(async (activePageId: string) => {
    const { success, data } = (await PageControllerShow(
      {
        id: activePageId,
      },
      {
        alwaysServerStructure: true,
      },
    )) as unknown as API.PageShowResponse;

    const stageData = data?.stage_data ? JSON.parse(data?.stage_data) : {};

    if (success) {
      initStageData(stageData);
    }
  });

  return {
    initSatgeDataWithPage,
  };
};
