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

  const { getData: getStatusSettings } = useModel('statusSettings', (model) => {
    return {
      getData: model?.getData,
    };
  });

  const { getData: getStatusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => {
      return {
        getData: model?.getData,
      };
    },
  );

  const { getData: getStatusRelations } = useModel(
    'statusRelations',
    (model) => {
      return {
        getData: model?.getData,
      };
    },
  );

  const { getData: getComsActions } = useModel('comsActions', (model) => {
    return {
      getData: model?.getData,
    };
  });

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
          comsStatusRelations: getStatusRelations(),
          comsTree: getComsTreeData(),
          comsModel: getComsModelData(),
          comsStatus: getStatusSettings(),
          comsStatusDefaults: getStatusSettingsDefaults(),
          comsActions: getComsActions(),
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
