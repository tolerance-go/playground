import { useSelectedData } from '@/hooks/useSelectedData';
import { DataTableColumn } from '@/models/dataList';
import { Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/lib/tree';
import { useMemo } from 'react';

type TreeNode = DataNode & {
  parentStatId?: string;
  relationId?: string;
};

export const ColumnsTree = () => {
  const { selectedData } = useSelectedData();
  const { columns } = selectedData?.data ?? {};

  /** 用 relations 和 maps 构建 tree */
  const treeData = useMemo(() => {
    const mapColumns = (cols: DataTableColumn[]): TreeNode[] => {
      return cols.map((col) => {
        const key = col.key ?? col.dataIndex?.toString();
        if (key === undefined) {
          throw new Error('key not defined');
        }
        return {
          key,
          title: col.title,
        };
      });
    };
    return mapColumns(columns ?? []);
  }, [columns]);

  const handleDrop: TreeProps<TreeNode>['onDrop'] = () =>
    // info
    {
      // const dropNode = info.node;
      // const dragNode = info.dragNode;
    };

  return (
    <Tree<TreeNode>
      draggable
      blockNode
      selectable
      treeData={treeData}
      onDrop={handleDrop}
    />
  );
};
