import { PageControllerUpdate } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { useGetStageData } from './useGetStageData';

export const useSaveStageDataWithPage = () => {
  const { getStageData } = useGetStageData();

  const { activePageId } = useModel('pageList', (model) => {
    return {
      activePageId: model?.activePageId,
    };
  });

  const saveStageDataWithPage = useMemoizedFn(() => {
    if (activePageId) {
      return PageControllerUpdate(
        {
          id: activePageId,
        },
        JSON.stringify(getStageData()),
      );
    }
    message.warn('缺少 ID 信息，无法正常保存');

    return { success: false };
  });

  return {
    saveStageDataWithPage,
  };
};
