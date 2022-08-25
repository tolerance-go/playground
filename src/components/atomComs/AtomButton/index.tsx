import { SLOTS_NAME } from '@/constants';
import { EventHandlerParams } from '@/domains/StageEventManager';
import { ComponentCommonStyle } from '@/models/comsStyles';
import { AtomComponentProps } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import { Button, ButtonProps } from 'antd';
import { CSSProperties, useEffect } from 'react';
import { AddSlotBtn } from '../../AddSlotProxy';
import { useCommonActionHandler } from '../_hooks/useCommonActionHandler';
import { getStyleFromDefaultStyle } from '../_utils/getStyleFromDefaultStyle';

export interface AtomButtonClickHandlerParams extends EventHandlerParams {
  data: object;
}

export type AtomButtonStyle = ComponentCommonStyle;

export type AtomButtonSettings = {
  type?: ButtonProps['type'];
  text?: string;
};

export const AtomButton = (
  props: AtomComponentProps<AtomButtonSettings, AtomButtonStyle>,
) => {
  const { text, ...rest } = props.settings ?? {};

  const { eventManager } = useModel('stage.eventManager', (model) => ({
    eventManager: model.eventManager,
  }));

  const { commonActionHandler } = useCommonActionHandler();

  useEffect(() => {
    const target = {
      comId: props.id,
      statId: props.statId,
    };
    const handlerId = eventManager.listenAll(
      ['button:click'],
      (params: AtomButtonClickHandlerParams) => {
        commonActionHandler(params);
      },
      target,
    );
    return () => {
      eventManager.unlistenAll(['button:click'], handlerId, target);
    };
  }, []);

  const style: CSSProperties = getStyleFromDefaultStyle(props.styles);

  return (
    <>
      <AddSlotBtn
        slots={props.slots}
        comId={props.id}
        slotName={SLOTS_NAME.ADDON_BEFORE}
      />

      <Button
        {...rest}
        style={style}
        onClick={() => {
          eventManager.dispatch(
            'button:click',
            {},
            {
              comId: props.id,
              statId: props.statId,
            },
          );
        }}
      >
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
