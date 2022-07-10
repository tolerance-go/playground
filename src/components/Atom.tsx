import { ElementsCxt } from '@/components/ElementsCtx';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useContext } from 'react';
import { AtomWrapper } from './AtomWrapper';

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

  return (
    <AtomWrapper {...props}>
      <Element
        key={props.id}
        {...{
          settings,
          slots,
          slotsOrder,
        }}
      />
    </AtomWrapper>
  );
};
