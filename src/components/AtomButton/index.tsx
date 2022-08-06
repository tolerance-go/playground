import { SLOTS_NAME } from '@/constants';
import { EventHandlerParams } from '@/domains/EventManager';
import { ComponentAction } from '@/models/comsActions';
import { ComponentStyle } from '@/models/comsStyles';
import { SwitchStatusAction } from '@/typings/actions';
import { AtomComponentProps } from '@/typings/ElementCenter';
import { joinUnitNumber } from '@/utils/joinUnitNumber';
import { useModel } from '@umijs/max';
import { Button, ButtonProps } from 'antd';
import { CSSProperties, useEffect } from 'react';
import { AddSlotBtn } from '../AddSlotProxy';

export interface AtomButtonClickHandlerParams extends EventHandlerParams {
  data: object;
}

export interface AtomButtonSwtichStatusAction extends ComponentAction {
  type: 'switchStatus';
  typeZh: '切换状态';
  settings: {
    targetComId: string;
    targetStatId: string;
  };
}

export type AtomButtonStyle = ComponentStyle;

export const AtomButton = (
  props: AtomComponentProps<
    {
      type?: ButtonProps['type'];
      text?: string;
    },
    AtomButtonStyle
  >,
) => {
  const { text, ...rest } = props.settings ?? {};

  const { eventManager } = useModel('eventManager', (model) => ({
    eventManager: model.eventManager,
  }));

  const { getComStatAction } = useModel('comsActions', (model) => ({
    getComStatAction: model.getComStatAction,
  }));

  const { setComStatusSettingsUsed } = useModel(
    'statusSettingsUsed',
    (model) => ({
      setComStatusSettingsUsed: model.setComStatusSettingsUsed,
    }),
  );

  useEffect(() => {
    const target = {
      comId: props.id,
      statId: props.statId,
    };
    const handlerId = eventManager.listen(
      'click',
      (params: AtomButtonClickHandlerParams) => {
        const { event } = params;
        const action = getComStatAction(
          event.execComId,
          event.execComStatId,
          event.execComStatActionId,
        );

        if (action.type === 'switchStatus') {
          const act = action as SwitchStatusAction;
          setComStatusSettingsUsed(
            act.settings.targetComId,
            act.settings.targetStatId,
          );
        }
      },
      target,
    );
    return () => {
      eventManager.unlisten('click', handlerId, target);
    };
  }, []);

  const style: CSSProperties = {
    width: joinUnitNumber(props.styles?.size?.width),
    height: joinUnitNumber(props.styles?.size?.height),
    marginTop: joinUnitNumber(props.styles?.marginPosition?.top),
    marginLeft: joinUnitNumber(props.styles?.marginPosition?.left),
    marginRight: joinUnitNumber(props.styles?.marginPosition?.right),
    marginBottom: joinUnitNumber(props.styles?.marginPosition?.bottom),
    paddingTop: joinUnitNumber(props.styles?.paddingPosition?.top),
    paddingLeft: joinUnitNumber(props.styles?.paddingPosition?.left),
    paddingRight: joinUnitNumber(props.styles?.paddingPosition?.right),
    paddingBottom: joinUnitNumber(props.styles?.paddingPosition?.bottom),
    position: props.styles?.positionType,
    top: joinUnitNumber(props.styles?.position?.top),
    left: joinUnitNumber(props.styles?.position?.left),
    right: joinUnitNumber(props.styles?.position?.right),
    bottom: joinUnitNumber(props.styles?.position?.bottom),
  };

  console.log('style', style);

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
            'click',
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
