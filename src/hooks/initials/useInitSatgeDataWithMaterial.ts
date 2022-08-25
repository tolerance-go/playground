import { ComponentControllerShow } from '@/services/server/ComponentController';
import { useMemoizedFn } from 'ahooks';
import { useInitSatgeData } from './useInitStageData';

export const useInitSatgeDataWithMaterial = () => {
  const { initStageData } = useInitSatgeData();

  const initSatgeDataWithMaterial = useMemoizedFn(
    async (activeMaterialId: string) => {
      const { success, data } = await ComponentControllerShow({
        id: activeMaterialId,
      });


      if (success) {
        const stageData = data?.stage_data ? JSON.parse(data?.stage_data) : {};
        initStageData(stageData);
      }
    },
  );

  return {
    initSatgeDataWithMaterial,
  };
};
