import { useComActiveMaterialIdEffect } from './useComActiveMaterialIdEffect';
import { useStageSelectedNodeIdEffect } from './useStageSelectedNodeIdEffect';
import { useDataListUpdate } from './useDataListUpdate';
import useStageSelectSlotGroupIdEffect from './useStageSelectSlotGroupIdEffect';

/** 存放一些全局的 view model */
export default () => {
  useStageSelectSlotGroupIdEffect();
  useComActiveMaterialIdEffect();
  useDataListUpdate();
  useStageSelectedNodeIdEffect();
  return <></>;
};
