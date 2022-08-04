import { ElementsCxt } from '@/components/ElementsCtx';
import { useComponentDefaultSettings } from '@/hooks/useComponentDefaultSettings';
import { useComponentSettings } from '@/hooks/useComponentSettings';
import { useComponentUsedSettings } from '@/hooks/useComponentUsedSettings';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useContext } from 'react';
import { AtomWrapper } from './Wrapper';

/**
 * 通过 model 生成组件
 * 舞台上的组件
 */
export const Atom = (props: StageComponentsModelItem) => {
  const elements = useContext(ElementsCxt);

  const Element = elements[props.type];
  const { slots, slotsOrder } = props;

  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const { settings: defaultSettings, defaultStatId } =
    useComponentDefaultSettings(props.id);
  const { settings: usedSettings, usedStatId } = useComponentUsedSettings(
    props.id,
  );
  const { settings } = useComponentSettings(props.id);

  consola.info('渲染 atom 组件', props.id);

  /**
   * 选中状态 settings 优先级最高
   * 其他 used 大于 defaults
   */
  const el = (
    <Element
      key={props.id}
      {...{
        id: props.id,
        /** 每个组件都一定存在一个默认状态 */
        statId: (usedStatId ?? defaultStatId) as string,
        settings:
          stageSelectNodeId === props.id
            ? settings ?? usedSettings ?? defaultSettings
            : usedSettings ?? defaultSettings,
        slots,
        slotsOrder,
      }}
    />
  );

  if (location.pathname === '/playground') {
    return el;
  }

  return (
    <AtomWrapper {...props} usedStat={usedStatId !== undefined}>
      {el}
    </AtomWrapper>
  );
};
