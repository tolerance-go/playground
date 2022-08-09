import { useSaveStageDataWithPage } from '@/hooks/useSaveStageDataWithPage';
import { useModel, useRequest } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';

export const useAutoSave = () => {
  const { saveStageDataWithPage: saveStageComsData } = useSaveStageDataWithPage();

  const { prepareSaveTime, updateAutoSaveTime } = useModel('stageAutoSave');

  const { loading, run } = useRequest(
    async () => {
      const { success } = await saveStageComsData();

      if (success) {
        updateAutoSaveTime();
      }

      return { success };
    },
    {
      manual: true,
    },
  );

  /** 当触发保存的时间修改，调用接口执行保存 */
  useUpdateEffect(() => {
    if (prepareSaveTime) {
      setTimeout(() => {
        run();
      });
    }
  }, [prepareSaveTime]);

  return {
    loading,
  };
};
