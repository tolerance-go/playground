import { useModel } from '@umijs/max';
import { useEffect } from 'react';

export const useComponentStatusChange = () => {
  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatus',
    (model) => ({
      selectedComponentStatusId: model?.selectedComponentStatusId,
    }),
  );

  const { setComponentSettings } = useModel('componentsSettings', (model) => ({
    setComponentSettings: model?.setComponentSettings,
  }));

  const { getLatestComponentsStatus } = useModel('statusSettings', (model) => ({
    getLatestComponentsStatus: model?.getLatestComponentsStatus,
  }));

  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  /** 变化状态后，将配置中心的配置进行应用 */
  useEffect(() => {
    if (selectedComponentStatusId && stageSelectNodeId) {
      const componentsStatus = getLatestComponentsStatus();
      const { settings } =
        componentsStatus?.[stageSelectNodeId]?.[selectedComponentStatusId]
          ?.configs ?? {};
      setComponentSettings(stageSelectNodeId, settings);
    }
  }, [selectedComponentStatusId, stageSelectNodeId]);
};
