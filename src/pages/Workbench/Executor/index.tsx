import { useComponentStatusChange } from '@/hooks/useComponentStatusChange';
import { useSelectedNodeMeta } from '@/hooks/useSelectedNode';
import useStageSelectSwitch from '@/hooks/useStageSelectSwitch';

/** 存放一些全局的 view model */
export default () => {
  useStageSelectSwitch();
  useComponentStatusChange();
  useSelectedNodeMeta();
  return <></>;
};
