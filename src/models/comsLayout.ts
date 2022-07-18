import { useState } from 'react';

export type NormalStatus = 'page' | 'layout' | 'asset';

const useComsLayout = () => {
  const [expanedKeys, setExpanedKeys] = useState<React.Key[]>();

  return {
    expanedKeys,
    setExpanedKeys,
  };
};

export default useComsLayout;
