import { SLOTS_NAME } from '@/constants';
import { joinSlotGroupId } from '@/helps';
import { SlotPosition } from '@/models/slotsInsert';
import { ComponentStructure } from '@/models/page/comsStructures';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { useMemo } from 'react';
import { Atom } from '../Atom';
import SlotGroup from './SlotGroup';

export const AddSlotBtn = ({
  comId,
  slotName,
  slots,
}: {
  comId: string;
  slotName: string;
  slots?: Record<string, string[]>;
}) => {
  const { setMode } = useModel('workbench.siderLeftMode', (model) => ({
    setMode: model?.setSiderLeftMode,
  }));

  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));

  const {
    setFocusComId,
    setFocusSlotName,
    setFocusSlotPosition,
    focusSlotPosition,
    focusComId,
    focusSlotName,
  } = useModel('stage.slotsInsert', (model) => ({
    setFocusComId: model?.setFocusComId,
    setFocusSlotName: model?.setFocusSlotName,
    setFocusSlotPosition: model?.setFocusSlotPosition,
    focusSlotPosition: model?.focusSlotPosition,
    focusComId: model?.focusComId,
    focusSlotName: model?.focusSlotName,
  }));

  const { stageComponentsModel } = useModel('page.comsStructures', (model) => {
    return {
      stageComponentsModel: model?.stageComponentsModel,
    };
  });

  const slotModels = useMemo(() => {
    return slots?.[slotName]
      ? slots?.[slotName]
          .map((childId) => stageComponentsModel?.[childId])
          .filter(
            (item): item is ComponentStructure => item !== undefined,
          )
      : undefined;
  }, [slots, slotName, stageComponentsModel]);

  const renderBtn = (slotPos: SlotPosition) => {
    return stageMode === 'playground' ? null : (
      <Button
        shape="circle"
        size="small"
        style={{
          margin: 4,
        }}
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
    <Atom key={model?.id} {...model} />
  ));

  const slotId = joinSlotGroupId(comId, slotName);

  if (slotName === SLOTS_NAME.ADDON_BEFORE) {
    return (
      <SlotGroup slotGroupId={slotId} hasSlotsDom={!!slotsDom?.length}>
        {renderBtn('before')}
        {slotsDom}
      </SlotGroup>
    );
  }

  if (slotName === SLOTS_NAME.ADDON_AFTER) {
    return (
      <SlotGroup slotGroupId={slotId} hasSlotsDom={!!slotsDom?.length}>
        {slotsDom}
        {renderBtn('after')}
      </SlotGroup>
    );
  }

  return (
    <SlotGroup slotGroupId={slotId} hasSlotsDom={!!slotsDom?.length}>
      {renderBtn('before')}
      {slotsDom}
      {slotsDom ? renderBtn('after') : null}
    </SlotGroup>
  );
};
