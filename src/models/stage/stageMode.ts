import { useState } from 'react';

/** 舞台的模式 */
const useStageMode = () => {
  const [stageMode, setStageMode] = useState<
    'playground' | 'workbench' | undefined
  >(() => {
    if (location.pathname === '/playground') {
      return 'playground';
    }
    if (location.pathname === '/workbench') {
      return 'workbench';
    }
    return undefined;
  });

  return {
    stageMode,
    setStageMode,
  };
};

export default useStageMode;
