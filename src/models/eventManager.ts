import { EventManager } from '@/domains/StageEventManager';
import { useState } from 'react';

/** 事件处理中心 */
const useEventManager = () => {
  const [eventManager] = useState(
    new EventManager(location.pathname !== '/playground'),
  );
  return {
    eventManager,
  };
};

export default useEventManager;
