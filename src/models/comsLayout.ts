import { TreeDataNode } from 'antd';
import { useState } from 'react';

export type NormalStatus = 'page' | 'layout' | 'asset';

export type SelfTreeDataNode = TreeDataNode & {
  data: {
    type: string;
  };
};

const useComsLayout = () => {
  const [expanedKeys, setExpanedKeys] = useState<React.Key[]>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();
  const [selectedNodes, setSelectedNodes] = useState<SelfTreeDataNode[]>();

  return {
    selectedKeys,
    expanedKeys,
    selectedNodes,
    setSelectedNodes,
    setSelectedKeys,
    setExpanedKeys,
  };
};

export default useComsLayout;
