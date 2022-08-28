import { EventManager } from '@/domains/StageEventManager';
import { useModel } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useState } from 'react';

/** 事件处理中心 */
const useEventManager = () => {
  const [eventManager] = useState(
    new EventManager(location.pathname !== '/playground'),
  );
  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));

  useUpdateEffect(() => {
    if (location.pathname === '/workbench') {
      if (stageMode === 'playground') {
        eventManager.enable();
      } else {
        eventManager.disable();
      }
    }
  }, [stageMode]);

  return {
    eventManager,
  };
};

export default useEventManager;
