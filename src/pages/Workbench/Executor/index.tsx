import { useComponentStatusChange } from '@/hooks/useComponentStatusChange';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import useStageSelectSwitch from '@/hooks/useStageSelectSwitch';

/** 存放一些全局的 view model */
export default () => {
  useStageSelectSwitch();
  useComponentStatusChange();
  useSelectedNode();
  return <></>;
};
