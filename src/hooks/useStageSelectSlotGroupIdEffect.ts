import { useModel } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';

/**
 * model 中存在相互依赖，因此抽到这里
 * https://github.com/umijs/umi/issues/8666
 */
const useStageSelectSlotGroupIdEffect = () => {
  const { stageSelectSlotGroupId } = useModel(
    'stage.stageSelectSlotGroupId',
    (model) => ({
      stageSelectSlotGroupId: model?.stageSelectSlotGroupId,
    }),
  );

  const { setStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    setStageSelectNodeId: model?.setStageSelectNodeId,
  }));

  /** 当舞台选中插槽组时候，清空选中的组件 */
  useUpdateEffect(() => {
    if (stageSelectSlotGroupId) {
      setStageSelectNodeId(undefined);
    }
  }, [stageSelectSlotGroupId]);
};

export default useStageSelectSlotGroupIdEffect;
