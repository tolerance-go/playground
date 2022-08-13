import { useState } from 'react';
import { BoxSize } from './comsStyles';

/** 舞台插槽组的选择 */
const useStageSize = () => {
  const [stageSize, setStageSize] = useState<BoxSize>();

  return {
    stageSize,
    setStageSize,
  };
};

export default useStageSize;
