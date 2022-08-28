import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';

export type StageSlotGroupNode = {
  /** 所在的插槽名称 */
  slotName: string;
  /** 父组件的 id */
  parentId: string;
  /** 所在的组件 id */
  comId: string;
  id: string;
  /**
   * key 为插槽名称，插槽存在多种，不单单是 children
   * value 为组件的 id
   */
  slots: string[];
  display: 'block' | 'inline';
};

/** 舞台插槽组的选择 */
const useStageSelectSlotGroup = () => {
  const [stageSelectSlotGroupId, setStageSelectSlotGroupId] =
    useState<string>();

  const { openTargetFromTreeMenu } = useModel('workbench.comsLayout', (model) => ({
    openTargetFromTreeMenu: model?.openTargetFromTreeMenu,
  }));

  /** 当舞台选中组件 id 发生变化，打开树形节点菜单 */
  useEffect(() => {
    if (stageSelectSlotGroupId) {
      openTargetFromTreeMenu(stageSelectSlotGroupId);
    }
  }, [stageSelectSlotGroupId]);

  return {
    stageSelectSlotGroupId: stageSelectSlotGroupId,
    setStageSelectSlotGroupId: setStageSelectSlotGroupId,
  };
};

export default useStageSelectSlotGroup;
