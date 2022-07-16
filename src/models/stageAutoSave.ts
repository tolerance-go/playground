import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

const useStageAutoSave = () => {
  /** 最近自动保存时间 */
  const [autoSaveLastTime, setAutoSaveLastTime] = useState<number>();
  /** 触发自动保存的时间 */
  const [triggerSaveTime, setTriggerSaveTime] = useState<number>();

  /** 刷新最近保存时间 */
  const triggerSaveTimeChange = useMemoizedFn(() => {
    setTriggerSaveTime(Date.now());
  });

  /** 更新最近保存时间 */
  const updateAutoSaveTime = useMemoizedFn(() => {
    setAutoSaveLastTime(triggerSaveTime);
  });

  return {
    autoSaveLastTime,
    triggerSaveTime,
    updateAutoSaveTime,
    triggerSaveTimeChange,
  };
};

export default useStageAutoSave;
