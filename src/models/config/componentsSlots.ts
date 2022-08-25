import { SLOTS_NAME } from '@/constants';
import { useState } from 'react';

/**
 * 组件对应配置表单的描述信息
 * 及其组件对应初始化配置信息
 */
const useComponentsSlots = () => {
  const [comsSlotsNames, setComsSlotsNames] = useState<
    Record<string, string[]>
  >({
    button: ['children', SLOTS_NAME.ADDON_AFTER, SLOTS_NAME.ADDON_BEFORE],
    line: [SLOTS_NAME.ADDON_AFTER, SLOTS_NAME.ADDON_BEFORE],
    table: [SLOTS_NAME.ADDON_AFTER, SLOTS_NAME.ADDON_BEFORE],
  });

  return {
    comsSlotsNames,
    setComsSlotsNames,
  };
};

export default useComponentsSlots;
