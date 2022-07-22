import { ElementsCxt } from '@/components/ElementsCtx';
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

  const { settings } = useModel('componentsSettings', (model) => {
    return {
      settings: model.settings[props.id],
    };
  });

  const Element = elements[props.type];
  const { slots, slotsOrder } = props;

  consola.info('渲染 atom 组件', props.id);

  const el = (
    <Element
      key={props.id}
      {...{
        id: props.id,
        settings,
        slots,
        slotsOrder,
      }}
    />
  );

  if (location.pathname === '/playground') {
    return el;
  }

  return <AtomWrapper {...props}>{el}</AtomWrapper>;
};
