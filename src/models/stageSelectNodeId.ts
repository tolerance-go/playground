import { useModel } from '@umijs/max';
import { useGetState, useUpdateEffect } from 'ahooks';
import consola from 'consola';
import { useEffect } from 'react';

const useStageSelectNodeId = () => {
  const [stageSelectNodeId, setStageSelectNodeId, getStageSelectNodeId] =
    useGetState<string>();

  const { openTargetFromTreeMenu } = useModel('comsLayout', (model) => ({
    openTargetFromTreeMenu: model?.openTargetFromTreeMenu,
  }));

  const { setNormalStatus, setMode } = useModel('siderLeftMode', (model) => ({
    setNormalStatus: model?.setNormalStatus,
    setMode: model?.setMode,
  }));

  const { setStageSelectSlotGroupId } = useModel(
    'stageSelectSlotGroupId',
    (model) => ({
      setStageSelectSlotGroupId: model?.setStageSelectSlotGroupId,
    }),
  );

  const { setSelectedKeys } = useModel('comsLayout', (model) => ({
    setSelectedKeys: model?.setSelectedKeys,
  }));

  const { selectedComponentStatusIdFromComDefaultStatus } = useModel(
    'statusSettingsDefaults',
    (model) => ({
      selectedComponentStatusIdFromComDefaultStatus:
        model.selectRightPanelComStatusIdFromDefault,
    }),
  );

  const { setMode: setRightBarMode } = useModel('siderRightMode', (model) => ({
    setMode: model?.setMode,
  }));

  /** 当舞台选中组件 id 发生变化，打开树形节点菜单 */
  useEffect(() => {
    if (stageSelectNodeId) {
      openTargetFromTreeMenu(stageSelectNodeId);
    }
  }, [stageSelectNodeId]);

  /** 当舞台选中组件时候，清空选中的插槽组 */
  useUpdateEffect(() => {
    if (stageSelectNodeId) {
      setStageSelectSlotGroupId(undefined);
    }
  }, [stageSelectNodeId]);

  /** 选中组件后，设置布局选中 key */
  useUpdateEffect(() => {
    if (stageSelectNodeId) {
      setSelectedKeys([stageSelectNodeId]);
    }
  }, [stageSelectNodeId]);

  /** 选中组件后，设置 right panel 选中状态 tab */
  useUpdateEffect(() => {
    if (stageSelectNodeId) {
      selectedComponentStatusIdFromComDefaultStatus(stageSelectNodeId);
    }
  }, [stageSelectNodeId]);

  /** 当舞台选中组件，切换布局 */
  useEffect(() => {
    if (stageSelectNodeId) {
      setMode('normal');
      setNormalStatus('layout');
    }
  }, [stageSelectNodeId]);

  /** 选中组件后，设置 right panel 的模式为 settings */
  useUpdateEffect(() => {
    if (stageSelectNodeId) {
      consola.success('激活右侧配置面板');
      setRightBarMode('settings');
    }
  }, [stageSelectNodeId]);

  return {
    stageSelectNodeId,
    setStageSelectNodeId,
    getStageSelectNodeId,
  };
};

export default useStageSelectNodeId;
