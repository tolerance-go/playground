import { PageControllerUpdate } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { useGetStageData } from './useGetStageData';

export const useSaveStageDataWithPage = () => {
  const { getStageData } = useGetStageData();

  const { activePageId } = useModel('page.pageList', (model) => {
    return {
      activePageId: model?.selectedPageId,
    };
  });

  const saveStageDataWithPage = useMemoizedFn(() => {
    if (activePageId) {
      PageControllerUpdate(
        {
          id: activePageId,
        },
        JSON.stringify(getStageData()),
      );
    } else {
      message.warn('缺少 ID 信息，无法正常保存');
    }
  });

  return {
    saveStageDataWithPage,
  };
};
