import { useState } from 'react';

const useHoverNodeId = () => {
  const [hoverNodeId, setHoverNodeId] = useState<string>();

  window.__consola.info('当前 hoverNodeId 变化', hoverNodeId);

  return {
    hoverNodeId,
    setHoverNodeId,
  };
};

export default useHoverNodeId;
