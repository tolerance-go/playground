import { useState } from 'react';

const useSiderRightMode = () => {
  const [mode, setMode] = useState<'normal' | 'settings'>('normal');
  return {
    mode,
    setMode,
  };
};

export default useSiderRightMode;
