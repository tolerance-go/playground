import { useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useEffect, useState } from 'react';

const useStageSelectNodeId = () => {
  const [stageSelectNodeId, setStageSelectNodeId] = useState<string>();

  const { openTargetFromTreeMenu } = useModel('comsLayout', (model) => ({
    openTargetFromTreeMenu: model?.openTargetFromTreeMenu,
  }));

  const { setNormalStatus, setMode } = useModel('siderLeftMode', (model) => ({
    setNormalStatus: model?.setNormalStatus,
    setMode: model?.setMode,
  }));

  const { setStageSelectSlotGroupId, stageSelectSlotGroupId } = useModel(
    'stageSelectSlotGroupId',
    (model) => ({
      setStageSelectSlotGroupId: model?.setStageSelectSlotGroupId,
      stageSelectSlotGroupId: model?.stageSelectSlotGroupId,
    }),
  );

  const getStageSelectNodeId = useMemoizedFn(() => {
    return stageSelectNodeId;
  });

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

  /** 当舞台选中组件时候，清空选中的插槽组 */
  useUpdateEffect(() => {
    if (stageSelectNodeId) {
      setStageSelectSlotGroupId(undefined);
    }
  }, [stageSelectNodeId]);

  return {
    stageSelectNodeId,
    setStageSelectNodeId,
    getStageSelectNodeId,
  };
};

export default useStageSelectNodeId;
