import { Atom } from '@/components/Atom';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { AtomComponentProps } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import { Button, ButtonProps } from 'antd';

export const AtomButton = (
  props: AtomComponentProps<{
    type?: ButtonProps['type'];
    text?: string;
  }>,
) => {
  const { childrenModels } = useModel('stageComponentsModel', (model) => ({
    childrenModels: props.slots?.children
      ? props.slots?.children
          .map((childId) => model.stageComponentsModel?.[childId])
          .filter(
            (item): item is StageComponentsModelItem => item !== undefined,
          )
      : undefined,
  }));

  const { text, ...rest } = props.settings;

  return (
    <Button {...rest}>
      {text ?? (
        <>
          {childrenModels?.map((model) => (
            <Atom key={model.id} {...model} />
          ))}
        </>
      )}
    </Button>
  );
};
