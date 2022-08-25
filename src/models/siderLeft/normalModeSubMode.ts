import { useState } from 'react';

export type NormalStatus = 'page' | 'layout' | 'material';

const useNormalModeSubMode = () => {
  const [normalStatus, setNormalStatus] = useState<NormalStatus>('page');
  return {
    normalStatus,
    setNormalStatus,
  };
};

export default useNormalModeSubMode;
