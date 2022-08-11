import { useState } from 'react';

/** 路径管理 */
const useSelectedDataId = () => {
  /** 当前激活的 page path */
  const [selectedDataId, setSelectedDataId] = useState<number>();

  return {
    selectedDataId,
    setSelectedDataId,
  };
};

export default useSelectedDataId;
