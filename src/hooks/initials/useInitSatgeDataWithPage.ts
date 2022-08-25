import { PageControllerShow } from '@/services/server/PageController';
import { useMemoizedFn } from 'ahooks';
import { useInitSatgeData } from './useInitStageData';

export const useInitSatgeDataWithPage = () => {
  const { initStageData } = useInitSatgeData();

  const initSatgeDataWithPage = useMemoizedFn(async (activePageId: number) => {
    try {
      const data = await PageControllerShow({
        id: activePageId,
      });
      const stageData = data?.stage_data ? JSON.parse(data?.stage_data) : {};
      initStageData(stageData);
    } catch {}
  });

  return {
    initSatgeDataWithPage,
  };
};
