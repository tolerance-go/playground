import { useSelectedData } from '@/hooks/selected/useSelectedData';
import { DataTableColumn } from '@/models/dataList';
import { useModel } from '@umijs/max';
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

  const { selectedFieldId, setSelectedColumnFieldId } = useModel(
    'database.dataFieldsConfig',
    (model) => ({
      selectedFieldId: model.selectedColumnFieldId,
      setSelectedColumnFieldId: model.setSelectedColumnFieldId,
    }),
  );

  /** 用 relations 和 maps 构建 tree */
  const treeData = useMemo(() => {
    const mapColumns = (cols: DataTableColumn[]): TreeNode[] => {
      return cols.map((col) => {
        const key = col.key;
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
      selectedKeys={selectedFieldId ? [selectedFieldId] : undefined}
      treeData={treeData}
      onDrop={handleDrop}
      onSelect={(selectedKeys) => {
        if (selectedKeys[0]) {
          setSelectedColumnFieldId(String(selectedKeys[0]));
        }
      }}
    />
  );
};
