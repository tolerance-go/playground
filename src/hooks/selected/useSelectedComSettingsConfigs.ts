import { useSelectedNode } from '@/hooks/selected/useSelectedNode';
import { useModel } from '@umijs/max';
import consola from 'consola';

/** 获取当前选中组件配置的设置选项 */
export const useSelectedComSettingsConfigs = () => {
  const { stageSelectNode } = useSelectedNode();

  const { componentsConfigs } = useModel(
    'config.comsSettingsConfigs',
    (model) => {
      consola.info('准备返回渲染配置', stageSelectNode, model);
      return {
        componentsConfigs: model?.componentsConfigs,
      };
    },
  );

  const configs = stageSelectNode?.type
    ? componentsConfigs[stageSelectNode.type]
    : undefined;

  consola.info('渲染配置表单', configs);

  return {
    configs,
  };
};
