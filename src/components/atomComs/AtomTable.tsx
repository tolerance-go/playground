import { SLOTS_NAME } from '@/constants';
import { EventHandlerParams } from '@/domains/StageEventManager';
import { ComponentAction } from '@/models/comsActions';
import { ComponentCommonStyle } from '@/models/comsStyles';
import { RecordType } from '@/typings';
import { AtomComponentProps } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import { Table, TableProps } from 'antd';
import { CSSProperties, useEffect } from 'react';
import { AddSlotBtn } from '../AddSlotProxy';
import { useCommonActionHandler } from './_hooks/useCommonActionHandler';
import { getStyleFromDefaultStyle } from './_utils/getStyleFromDefaultStyle';

export interface AtomTableDidMountHandlerParams extends EventHandlerParams {
  data: object;
}

export interface AtomTableRequestDataSourceAction extends ComponentAction {
  settings: {
    dataId: string;
  };
}

export type AtomTableStyle = ComponentCommonStyle;

export type AtomTableSettings = {
  columns?: TableProps<RecordType>['columns'];
  dataSource?: RecordType[];
};

export const AtomTable = (
  props: AtomComponentProps<AtomTableSettings, AtomTableStyle>,
) => {
  const { ...rest } = props.settings ?? {};

  const { eventManager } = useModel('stage.eventManager', (model) => ({
    eventManager: model.eventManager,
  }));

  const { getTableDataSourceByDataId } = useModel('database.dataList', (model) => ({
    getTableDataSourceByDataId: model.getTableDataSourceByDataId,
  }));

  const { updateComStatSetting } = useModel('page.comsSettings', (model) => ({
    updateComStatSetting: model.updateComStatSetting,
  }));

  const { commonActionHandler } = useCommonActionHandler();

  useEffect(() => {
    const target = {
      comId: props.id,
      statId: props.statId,
    };

    const handlerIds = eventManager.listenAll(
      ['table:didMount', 'button:click'],
      (params: AtomTableDidMountHandlerParams) => {
        commonActionHandler(params, (action) => {
          const { event } = params;

          if (action.type === 'table:requestDataSource') {
            const act = action as AtomTableRequestDataSourceAction;
            const dataSource = getTableDataSourceByDataId(
              Number(act.settings.dataId),
            );
            updateComStatSetting(event.execComId, event.execComStatId, {
              dataSource,
            });
          }
        });
      },
      target,
    );
    return () => {
      eventManager.unlistenAll(
        ['table:didMount', 'button:click'],
        handlerIds,
        target,
      );
    };
  }, []);

  useEffect(() => {
    eventManager.dispatch(
      'table:didMount',
      {},
      {
        comId: props.id,
        statId: props.statId,
      },
    );
  }, []);

  const style: CSSProperties = getStyleFromDefaultStyle(props.styles);

  return (
    <>
      <AddSlotBtn
        slots={props.slots}
        comId={props.id}
        slotName={SLOTS_NAME.ADDON_BEFORE}
      />
      <Table {...rest} style={style}></Table>
      <AddSlotBtn
        slots={props.slots}
        comId={props.id}
        slotName={SLOTS_NAME.ADDON_AFTER}
      />
    </>
  );
};
