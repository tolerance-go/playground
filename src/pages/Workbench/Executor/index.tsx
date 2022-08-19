import { useActivePageIdEffect } from '@/hooks/globals/useActivePageIdEffect';
import { useComActiveMaterialIdEffect } from '@/hooks/globals/useComActiveMaterialIdEffect';
import { useDataListUpdate } from '@/hooks/globals/useDataListUpdate';
import { useComponentStatusChange } from '@/hooks/useComponentStatusChange';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import useStageSelectSlotGroupIdEffect from '@/hooks/useStageSelectSlotGroupIdEffect';

/** 存放一些全局的 view model */
export default () => {
  useStageSelectSlotGroupIdEffect();
  useComponentStatusChange();
  useSelectedNode();
  useComActiveMaterialIdEffect();
  useActivePageIdEffect();
  useDataListUpdate();
  return <></>;
};
