import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

const useStageAutoSave = () => {
  /** 最近自动保存时间 */
  const [autoSaveLastTime, setAutoSaveLastTime] = useState<number>();
  /** 触发自动保存的时间 */
  const [triggerSaveTime, setTriggerSaveTime] = useState<number>();

  /** 刷新最近保存时间，触发接口同步，成功后修改保存时间 */
  const triggerSave = useMemoizedFn(() => {
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
    triggerSave,
  };
};

export default useStageAutoSave;
