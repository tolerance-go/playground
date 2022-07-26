import { SLOTS_NAME } from '@/constants';
import { AtomComponentProps } from '@/typings/ElementCenter';
import { Button, ButtonProps } from 'antd';
import { AddSlotBtn } from '../AddSlotProxy';

export const AtomButton = (
  props: AtomComponentProps<{
    type?: ButtonProps['type'];
    text?: string;
  }>,
) => {
  const { text, ...rest } = props.settings ?? {};

  return (
    <>
      <AddSlotBtn
        slots={props.slots}
        comId={props.id}
        slotName={SLOTS_NAME.ADDON_BEFORE}
      />
      <Button {...rest}>
        {!!text ? (
          text
        ) : (
          <AddSlotBtn
            slots={props.slots}
            comId={props.id}
            slotName={'children'}
          />
        )}
      </Button>
      <AddSlotBtn
        slots={props.slots}
        comId={props.id}
        slotName={SLOTS_NAME.ADDON_AFTER}
      />
    </>
  );
};
