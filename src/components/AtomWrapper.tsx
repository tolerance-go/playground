import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import consola from 'consola';
import React from 'react';

/**
 * 舞台节点的包装组件
 * 所有舞台组件都会包裹一层该组件
 * 他会响应用户设计阶段的选择事件进行操作，选中并且进行设置
 */
export const AtomWrapper = (
  props: React.PropsWithChildren<StageComponentsModelItem>,
) => {
  const { setSelectNodeMeta } = useModel('selectNodeMeta', (model) => ({
    setSelectNodeMeta: model.setSelectNodeMeta,
  }));

  const { setMode: setRightBarMode } = useModel('siderRightMode', (model) => ({
    setMode: model.setMode,
  }));

  return (
    <div
      style={{
        padding: '2px',
        border: '1px solid blue',
        display: props.display === 'inline' ? 'inline-block' : 'block',
      }}
      onClick={() => {
        consola.info('atom 被点击', props);

        setSelectNodeMeta({
          type: props.type,
          id: props.id,
        });
        consola.success('选中组件', props.id);

        setRightBarMode('settings');
        consola.success('激活右侧配置面板');
      }}
    >
      {props.children}
    </div>
  );
};
