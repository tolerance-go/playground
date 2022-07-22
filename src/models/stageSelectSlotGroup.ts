import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';
import { splitSlotId } from './../helps/index';

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
  const [stageSelectSlotGroup, setStageSelectSlotGroup] =
    useState<StageSlotGroupNode>();
  const [stageSelectSlotGroupId, setStageSelectSlotGroupId] =
    useState<string>();

  const { getLatestStageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => ({
      getLatestStageComponentsModel: model.getLatestStageComponentsModel,
    }),
  );

  /** 当 id 变化，设置 group */
  useEffect(() => {
    if (stageSelectSlotGroupId) {
      const stageComponentsModel = getLatestStageComponentsModel();
      if (stageComponentsModel) {
        const { comId, slotName } = splitSlotId(stageSelectSlotGroupId);
        setStageSelectSlotGroup({
          id: stageSelectSlotGroupId,
          slots: stageComponentsModel[comId].slots[slotName],
          comId,
          slotName,
          parentId: stageComponentsModel[comId].parentId,
          display: 'inline',
        });
      }
    } else {
      setStageSelectSlotGroup(undefined);
    }
  }, [stageSelectSlotGroupId]);

  return {
    stageSelectSlotGroupId: stageSelectSlotGroupId,
    stageSelectSlotGroup: stageSelectSlotGroup,
    setStageSelectSlotGroupId: setStageSelectSlotGroupId,
  };
};

export default useStageSelectSlotGroup;
