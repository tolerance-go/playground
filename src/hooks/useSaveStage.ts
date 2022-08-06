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

  const { getData: getStatusSettings } = useModel('comsStatus', (model) => {
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

  const { getData: getComsEvents } = useModel('comsEvents', (model) => {
    return {
      getData: model?.getData,
    };
  });

  const { getData: getComsStyles } = useModel('comsStyles', (model) => {
    return {
      getData: model?.getData,
    };
  });

  const { getData: getComsSettings } = useModel('comsSettings', (model) => {
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
          // comsModel: getComsModelData(),
          comsStatus: getStatusSettings(),
          comsStatusDefaults: getStatusSettingsDefaults(),
          comsActions: getComsActions(),
          comsEvents: getComsEvents(),
          comsStyles: getComsStyles(),
          comsSettings: getComsSettings(),
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
