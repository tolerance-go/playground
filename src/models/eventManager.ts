import { EventManager } from '@/domains/EventManager';
import { useState } from 'react';

/** 事件处理中心 */
const useEventManager = () => {
  const [eventManager] = useState(new EventManager());
  window.__eventManager = eventManager;
  return {
    eventManager,
  };
};

export default useEventManager;
