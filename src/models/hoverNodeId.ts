import { useState } from 'react';

const useHoverNodeId = () => {
  const [hoverNodeId, setHoverNodeId] = useState<string>();

  return {
    hoverNodeId,
    setHoverNodeId,
  };
};

export default useHoverNodeId;
