import { useState } from 'react';

const useSelectNodeMeta = () => {
  const [selectNodeMeta, setSelectNodeMeta] = useState<{
    id: string;
    type: string;
  }>();
  return {
    selectNodeMeta,
    setSelectNodeMeta,
  };
};

export default useSelectNodeMeta;
