import { useState } from 'react';

const useWorkbenchIDESettings = () => {
  const [headerHeight, setHeaderHeight] = useState(64);
  const [siderLeftWidth, setSiderLeftWidth] = useState(300);

  return {
    headerHeight,
    setHeaderHeight,
    siderLeftWidth,
    setSiderLeftWidth
  };
};

export default useWorkbenchIDESettings;
