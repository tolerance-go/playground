import { useSaveStageDataWithPage } from '@/hooks/initials/useSaveStageDataWithPage';
import { useModel } from '@umijs/max';
import { useRequest, useUpdateEffect } from 'ahooks';

export const useAutoSave = () => {
  const { saveStageDataWithPage: saveStageComsData } =
    useSaveStageDataWithPage();

  const { prepareSaveTime, updateAutoSaveTime } = useModel('app.stageAutoSave');

  const { loading, run } = useRequest(
    async () => {
      saveStageComsData();
      updateAutoSaveTime();
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
