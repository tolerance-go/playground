// import { useModel } from '@umijs/max';
// import { useEffect } from 'react';

export const useComponentStatusChange = () => {
  // const { selectedComponentStatusId } = useModel(
  //   'stage.selectedComponentStatusId',
  //   (model) => ({
  //     selectedComponentStatusId: model?.selectedComponentStatusId,
  //   }),
  // );

  // const { setComponentSettings } = useModel('comsActiveSettings', (model) => ({
  //   setComponentSettings: model?.setComponentSettings,
  // }));

  // const { getLatestComponentsStatus } = useModel('stage.comsStatus', (model) => ({
  //   getLatestComponentsStatus: model?.getComponentsStatus,
  // }));

  // const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
  //   stageSelectNodeId: model?.stageSelectNodeId,
  // }));

  // /** 变化状态后，将配置中心的配置进行应用 */
  // useEffect(() => {
  //   if (selectedComponentStatusId && stageSelectNodeId) {
  //     const componentsStatus = getLatestComponentsStatus();
  //     const { settings } =
  //       componentsStatus?.[stageSelectNodeId]?.[selectedComponentStatusId]
  //         ?.configs ?? {};
  //     setComponentSettings(stageSelectNodeId, settings);
  //   }
  // }, [selectedComponentStatusId, stageSelectNodeId]);
};
