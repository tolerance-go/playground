import { useState } from 'react';

const useStageMode = () => {
  const [mode, setMode] = useState<'playground' | 'workbench' | undefined>(
    () => {
      if (location.pathname === '/playground') {
        return 'playground';
      }
      if (location.pathname === '/workbench') {
        return 'workbench';
      }
      return undefined;
    },
  );

  return {
    mode,
    setMode,
  };
};

export default useStageMode;
