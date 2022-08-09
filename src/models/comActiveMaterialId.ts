import { useState } from 'react';

const useComActiveMaterialId = () => {
  const [comActiveMaterialId, setComActiveMaterialId] = useState<string>();

  return {
    comActiveMaterialId,
    setComActiveMaterialId,
  };
};

export default useComActiveMaterialId;
