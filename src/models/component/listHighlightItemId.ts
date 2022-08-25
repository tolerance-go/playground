import { useState } from 'react';

const useListHighlightItemId = () => {
  const [highlightId, setHighlightId] = useState<number>();

  return {
    highlightId,
    setHighlightId,
  };
};

export default useListHighlightItemId;
