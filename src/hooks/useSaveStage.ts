import { PageControllerUpdate } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';

export const useSaveStage = () => {
  const { getData: getComsTreeData } = useModel(
    'stageComponentsModel',
    (model) => {
      return {
        getData: model?.getData,
      };
    },
  );

  const { getData: getComsModelData } = useModel(
    'componentsSettings',
    (model) => {
      return {
        getData: model?.getData,
      };
    },
  );

  const { activePageId } = useModel('pageList', (model) => {
    return {
      activePageId: model?.activePageId,
    };
  });

  const saveStageComsData = useMemoizedFn(() => {
    if (activePageId) {
      return PageControllerUpdate(
        {
          id: activePageId,
        },
        JSON.stringify({
          comsTree: getComsTreeData(),
          comsModel: getComsModelData(),
        }),
      );
    }
    message.warn('缺少 ID 信息，无法正常保存');

    return { success: false };
  });

  return {
    saveStageComsData,
  };
};
