import { useSelectedNode } from '@/hooks/selected/useSelectedNode';
import { useModel } from '@umijs/max';
import consola from 'consola';

/** 获取当前选中组件配置的设置选项 */
export const useSelectedComStyleConfigs = () => {
  const { stageSelectNode } = useSelectedNode();

  const { comsStylesConfigs } = useModel(
    'config.comsStyleConfigs',
    (model) => {
      consola.info('准备返回渲染配置', stageSelectNode, model);
      return {
        comsStylesConfigs: model.comsStylesConfigs,
      };
    },
  );

  const configs = stageSelectNode?.type
    ? comsStylesConfigs[stageSelectNode.type]
    : undefined;

  consola.info('渲染配置表单', configs);

  return {
    configs,
  };
};
