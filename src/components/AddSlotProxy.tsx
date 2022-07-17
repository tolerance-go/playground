import { SLOTS_NAME } from '@/constants';
import { SlotPosition } from '@/models/slotsInsert';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { useMemo } from 'react';
import { Atom } from './Atom';

export const AddSlotBtn = ({
  comId,
  slotName,
  slots,
}: {
  comId: string;
  slotName: string;
  slots?: Record<string, string[]>;
}) => {
  const { setMode } = useModel('siderLeftMode', (model) => ({
    setMode: model.setMode,
  }));

  const {
    setFocusComId,
    setFocusSlotName,
    setFocusSlotPosition,
    focusSlotPosition,
    focusComId,
    focusSlotName,
  } = useModel('slotsInsert', (model) => ({
    setFocusComId: model.setFocusComId,
    setFocusSlotName: model.setFocusSlotName,
    setFocusSlotPosition: model.setFocusSlotPosition,
    focusSlotPosition: model.focusSlotPosition,
    focusComId: model.focusComId,
    focusSlotName: model.focusSlotName,
  }));

  const { stageComponentsModel } = useModel('stageComponentsModel', (model) => {
    return {
      stageComponentsModel: model.stageComponentsModel,
    };
  });

  const slotModels = useMemo(() => {
    return slots?.[slotName]
      ? slots?.[slotName]
          .map((childId) => stageComponentsModel?.[childId])
          .filter(
            (item): item is StageComponentsModelItem => item !== undefined,
          )
      : undefined;
  }, [slots, slotName, stageComponentsModel]);

  const renderBtn = (slotPos: SlotPosition) => {
    return location.pathname === '/playground' ? null : (
      <Button
        className="add-slot-btn"
        shape="circle"
        size="small"
        type={
          comId === focusComId &&
          slotName === focusSlotName &&
          focusSlotPosition === slotPos
            ? 'primary'
            : 'dashed'
        }
        icon={
          <PlusOutlined
            style={{
              cursor: 'pointer',
            }}
          />
        }
        onClick={(event) => {
          setFocusComId(comId);
          setFocusSlotName(slotName);
          setFocusSlotPosition(slotPos);

          event.stopPropagation();
          setMode('insert');
        }}
      ></Button>
    );
  };

  const slotsDom = slotModels?.map((model) => (
    <Atom key={model.id} {...model} />
  ));

  if (slotName === SLOTS_NAME.ADDON_BEFORE) {
    return (
      <>
        {renderBtn('before')}
        {slotsDom}
      </>
    );
  }

  if (slotName === SLOTS_NAME.ADDON_AFTER) {
    return (
      <>
        {slotsDom}
        {renderBtn('after')}
      </>
    );
  }

  return (
    <>
      {renderBtn('before')}
      {slotsDom}
      {slotsDom ? renderBtn('after') : null}
    </>
  );
};
