import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

export type SlotPosition = 'before' | 'after';

/** 组件插槽相关的数据管理 */
const useSlotsInsert = () => {
  /** 当前聚焦的舞台组件 id */
  const [focusComId, setFocusComId] = useState<string>();
  /** 聚焦的插槽名称 */
  const [focusSlotName, setFocusSlotName] = useState<string>();

  /**
   * 当前聚焦的插槽的位置
   * 如果存在前后能添加的插槽，需要判断一下位置
   */
  const [focusSlotPosition, setFocusSlotPosition] =
    useState<SlotPosition>('after');

  const cleanFocusSlotsInert = useMemoizedFn(() => {
    setFocusComId(undefined);
    setFocusSlotName(undefined);
    setFocusSlotPosition('after');
  });

  return {
    focusComId,
    focusSlotName,
    focusSlotPosition,
    setFocusComId,
    setFocusSlotName,
    setFocusSlotPosition,
    cleanFocusSlotsInert,
  };
};

export default useSlotsInsert;
