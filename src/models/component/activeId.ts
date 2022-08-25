import { useState } from 'react';

const useComActiveMaterialId = () => {
  const [comActiveMaterialId, setComActiveMaterialId] =
    useState<API.Component['id']>();

  return {
    comActiveMaterialId,
    setComActiveMaterialId,
  };
};

export default useComActiveMaterialId;
