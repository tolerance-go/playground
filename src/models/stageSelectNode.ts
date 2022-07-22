import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';

const useStageSelectNode = () => {
  const [stageSelectNode, setStageSelectNode] =
    useState<StageComponentsModelItem>();
  const [stageSelectNodeId, setStageSelectNodeId] = useState<string>();

  const { getLatestStageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => ({
      getLatestStageComponentsModel: model?.getLatestStageComponentsModel,
    }),
  );

  const { openTargetFromTreeMenu } = useModel('comsLayout', (model) => ({
    openTargetFromTreeMenu: model?.openTargetFromTreeMenu,
  }));

  const { setNormalStatus, setMode } = useModel('siderLeftMode', (model) => ({
    setNormalStatus: model?.setNormalStatus,
    setMode: model?.setMode,
  }));

  useEffect(() => {
    if (stageSelectNodeId) {
      setStageSelectNode(getLatestStageComponentsModel()?.[stageSelectNodeId]);
    } else {
      setStageSelectNode(undefined);
    }
  }, [stageSelectNodeId]);

  /** 当舞台选中组件 id 发生变化，打开树形节点菜单 */
  useEffect(() => {
    if (stageSelectNodeId) {
      openTargetFromTreeMenu(stageSelectNodeId);
    }
  }, [stageSelectNodeId]);

  /** 当舞台选中组件，切换布局 */
  useEffect(() => {
    if (stageSelectNodeId) {
      setMode('normal');
      setNormalStatus('layout');
    }
  }, [stageSelectNodeId]);

  window.__consola.info('debug:', 'selectNodeMeta', stageSelectNode);

  return {
    stageSelectNodeId,
    stageSelectNode,
    setStageSelectNodeId,
  };
};

export default useStageSelectNode;
