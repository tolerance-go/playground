import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';

const useStageSelectNode = () => {
  const [selectNodeMeta, setSelectNodeMeta] =
    useState<StageComponentsModelItem>();
  const [selectNodeId, setSelectNodeId] = useState<string>();

  const { stageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
    }),
  );

  const { openTargetFromTreeMenu } = useModel('comsLayout', (model) => ({
    openTargetFromTreeMenu: model.openTargetFromTreeMenu,
  }));

  const { setNormalStatus, setMode } = useModel('siderLeftMode', (model) => ({
    setNormalStatus: model.setNormalStatus,
    setMode: model.setMode,
  }));

  useEffect(() => {
    if (selectNodeId) {
      setSelectNodeMeta(stageComponentsModel?.[selectNodeId]);
    } else {
      setSelectNodeMeta(undefined);
    }
  }, [selectNodeId]);

  /** 当舞台选中组件 id 发生变化，打开树形节点菜单 */
  useEffect(() => {
    if (selectNodeId) {
      openTargetFromTreeMenu(selectNodeId);
    }
  }, [selectNodeId]);

  /** 当舞台选中组件，切换布局 */
  useEffect(() => {
    if (selectNodeId) {
      setMode('normal');
      setNormalStatus('layout');
    }
  }, [selectNodeId]);

  window.__consola.info('debug:', 'selectNodeMeta', selectNodeMeta);

  return {
    selectNodeId,
    selectNodeMeta,
    setSelectNodeId,
  };
};

export default useStageSelectNode;
