import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import clsx from 'clsx';
import consola from 'consola';
import React from 'react';
import styles from './Wrapper.less';

/**
 * 舞台节点的包装组件
 * 所有舞台组件都会包裹一层该组件
 * 他会响应用户设计阶段的选择事件进行操作，选中并且进行设置
 */
export const AtomWrapper = (
  props: React.PropsWithChildren<StageComponentsModelItem>,
) => {
  const { setStageSelectNodeId, stageSelectNodeId } = useModel(
    'stageSelectNode',
    (model) => ({
      setStageSelectNodeId: model.setStageSelectNodeId,
      stageSelectNodeId: model.stageSelectNodeId,
    }),
  );
  const { hoverNodeId, setHoverNodeId } = useModel('hoverNodeId', (model) => ({
    hoverNodeId: model.hoverNodeId,
    setHoverNodeId: model.setHoverNodeId,
  }));

  const { setMode: setRightBarMode } = useModel('siderRightMode', (model) => ({
    setMode: model.setMode,
  }));

  const { setSelectedKeys } = useModel('comsLayout', (model) => ({
    setSelectedKeys: model.setSelectedKeys,
  }));

  return (
    <div
      className={clsx(styles.wrap, {
        [styles.selected]: stageSelectNodeId === props.id,
        [styles.hover]: hoverNodeId === props.id,
      })}
      style={{
        padding: 8,
        display: props.display === 'inline' ? 'inline-block' : 'block',
      }}
      onMouseEnter={(event) => {
        event.stopPropagation();
        if (props.id !== hoverNodeId) {
          consola.info('hover', '进入组件', props.id);
          setHoverNodeId(props.id);
        }
      }}
      onMouseOver={(event) => {
        event.stopPropagation();
        if (props.id !== hoverNodeId) {
          consola.info('hover', '悬停组件', props.id);
          setHoverNodeId(props.id);
        }
      }}
      onMouseLeave={(event) => {
        event.stopPropagation();
        if (props.id === hoverNodeId) {
          consola.info('hover', '离开组件', props.id);
          setHoverNodeId(undefined);
        }
      }}
      onClick={(event) => {
        consola.info('atom 被点击', props);

        setStageSelectNodeId(props.id);
        setSelectedKeys([props.id]);
        consola.success('选中组件', props.id);

        setRightBarMode('settings');
        consola.success('激活右侧配置面板');

        /** 防止多层级的 Atom */
        event.stopPropagation();
      }}
    >
      {props.children}
    </div>
  );
};
