import { useSelectedComponentStatus } from '@/hooks/selected/useSelectedComponentStatus';
import { makeTreeWithRelation } from '@/utils/treeUtils/makeTreeWithRelation';
import { mapTree } from '@/utils/treeUtils/mapTree';
import { useModel } from '@umijs/max';
import { Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/lib/tree';
import React, { useEffect, useMemo, useState } from 'react';

type ComStatusTreeNode = DataNode & {
  parentStatId?: string;
  relationId?: string;
};

export const ComStatusTreeMap = () => {
  const { status } = useSelectedComponentStatus();

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();

  const { comsStatusRelations, createComStatRelation, deleteComStatRelation } =
    useModel('page.statusConnectRelations', (model) => ({
      comsStatusRelations: model.comsStatusRelations,
      createComStatRelation: model.createComStatRelation,
      deleteComStatRelation: model.deleteComStatRelation,
    }));
  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const { triggerSaveTimeChange } = useModel('app.stageAutoSave', (model) => {
    return {
      triggerSaveTimeChange: model?.triggerPrepareSaveTimeChange,
    };
  });

  /** 用 relations 和 maps 构建 tree */
  const treeData = useMemo(() => {
    if (stageSelectNodeId && status) {
      const comStatusRelations = comsStatusRelations[stageSelectNodeId] ?? {};

      const tree = makeTreeWithRelation(status, comStatusRelations);

      /** 构建 tree 需要的数据结构 */
      const next = mapTree(tree, (item) => {
        return {
          key: item.id,
          title: item.name,
          parentStatId: item.parentId,
          relationId: item.relationId,
        };
      });

      return next;
    }
    return [];
  }, [status, comsStatusRelations]);

  const handleDrop: TreeProps<ComStatusTreeNode>['onDrop'] = (info) => {
    const dropNode = info.node;
    const dragNode = info.dragNode;

    if (stageSelectNodeId) {
      if (dragNode.relationId) {
        /** 拖拽后，统一删除老的关联关系 */
        deleteComStatRelation(stageSelectNodeId, dragNode.relationId);
      }

      /** 拖到某组件下，创建第一个子元素 */
      if (info.dropToGap === false) {
        createComStatRelation(stageSelectNodeId, {
          fromId: dropNode.key as string,
          toId: dragNode.key as string,
          settingUnsyncFields: {},
          styleUnsyncFields: {},
          actionUnsyncFields: {},
          eventUnsyncFields: {},
        });
      } else {
        /** 拖拽组件到同级组件后，此时 dropNode 是同级别的 */
        /** 拖拽组件到第一级别，解除继承关系 */
        if (dropNode.parentStatId === undefined) {
        } else {
          createComStatRelation(stageSelectNodeId, {
            fromId: dropNode.parentStatId as string,
            toId: dragNode.key as string,
            settingUnsyncFields: {},
            styleUnsyncFields: {},
            actionUnsyncFields: {},
            eventUnsyncFields: {},
          });
        }
      }
    }

    triggerSaveTimeChange();
  };

  /** 切换节点后，默认打开所有节点 */
  useEffect(() => {
    if (status) {
      setExpandedKeys(Object.keys(status));
    }
  }, [status]);

  return (
    <Tree<ComStatusTreeNode>
      draggable
      blockNode
      selectable
      expandedKeys={expandedKeys}
      treeData={treeData}
      onDrop={handleDrop}
      onExpand={setExpandedKeys}
    />
  );
};
