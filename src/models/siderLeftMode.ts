import { useState } from 'react';

const useSiderLeftMode = () => {
  const [mode, setMode] = useState<'normal' | 'components'>('normal');
  return {
    mode,
    setMode,
  };
};

export default useSiderLeftMode;
