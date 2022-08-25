import { useActivePageIdEffect } from '@/pages/Workbench/Executor/_hooks/useActivePageIdEffect';
import { useComActiveMaterialIdEffect } from '@/pages/Workbench/Executor/_hooks/useComActiveMaterialIdEffect';
import { useStageSelectedNodeIdEffect } from '@/pages/Workbench/Executor/_hooks/useStageSelectedNodeIdEffect';
import { useDataListUpdate } from '@/pages/Workbench/Executor/_hooks/useDataListUpdate';
import useStageSelectSlotGroupIdEffect from '@/pages/Workbench/Executor/_hooks/useStageSelectSlotGroupIdEffect';

/** 存放一些全局的 view model */
export default () => {
  useStageSelectSlotGroupIdEffect();
  useComActiveMaterialIdEffect();
  useActivePageIdEffect();
  useDataListUpdate();
  useStageSelectedNodeIdEffect();
  return <></>;
};
