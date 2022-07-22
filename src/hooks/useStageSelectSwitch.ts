import { useModel } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';

/**
 * model 中存在相互依赖，因此抽到这里
 * https://github.com/umijs/umi/issues/8666
 */
const useStageSelectSwitch = () => {
  const { setStageSelectSlotGroupId, stageSelectSlotGroupId } = useModel(
    'stageSelectSlotGroup',
    (model) => ({
      setStageSelectSlotGroupId: model.setStageSelectSlotGroupId,
      stageSelectSlotGroupId: model.stageSelectSlotGroupId,
    }),
  );

  const { stageSelectNodeId, setStageSelectNodeId } = useModel(
    'stageSelectNode',
    (model) => ({
      stageSelectNodeId: model.stageSelectNodeId,
      setStageSelectNodeId: model.setStageSelectNodeId,
    }),
  );

  /** 当舞台选中组件时候，清空选中的插槽组 */
  useUpdateEffect(() => {
    if (stageSelectNodeId) {
      setStageSelectSlotGroupId(undefined);
    }
  }, [stageSelectNodeId]);

  /** 当舞台选中插槽组时候，清空选中的组件 */
  useUpdateEffect(() => {
    if (stageSelectSlotGroupId) {
      setStageSelectNodeId(undefined);
    }
  }, [stageSelectSlotGroupId]);
};

export default useStageSelectSwitch;
