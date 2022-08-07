import { useSelectedComponentStatus } from '@/hooks/useSelectedComponentStatus';
import { ComponentStat } from '@/models/comsStatus';
import { useModel } from '@umijs/max';
import { Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/lib/tree';
import utl from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

type ComStatusTreeNode = DataNode & {
  parentStatId?: string;
  relationId?: string;
};

export const ComStatusTreeMap = () => {
  const { status } = useSelectedComponentStatus();

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();

  const { comsStatusRelations, createComStatRelation, deleteComStatRelation } =
    useModel('statusRelations', (model) => ({
      comsStatusRelations: model.comsStatusRelations,
      createComStatRelation: model.createComStatRelation,
      deleteComStatRelation: model.deleteComStatRelation,
    }));
  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const { triggerSaveTimeChange } = useModel('stageAutoSave', (model) => {
    return {
      triggerSaveTimeChange: model?.triggerPrepareSaveTimeChange,
    };
  });

  /** 用 relations 和 maps 构建 tree */
  const treeData = useMemo(() => {
    if (stageSelectNodeId && status) {
      type TreeItem = ComponentStat & {
        parentStatId?: string;
        children: TreeItem[];
        relationId?: string;
      };

      const comStatusRelations = comsStatusRelations[stageSelectNodeId] ?? {};
      /** 先克隆所有状态 */
      const allStatus: Record<string, TreeItem> = utl.mapValues(
        status,
        (val) => ({
          ...val,
          parentStatId: undefined,
          children: [],
        }),
      );
      /** 把所有状态的子节点填充满 */
      Object.keys(comStatusRelations).forEach((relationId) => {
        const relation = comStatusRelations[relationId];
        const fromItem = allStatus[relation.fromStatId];
        const toItem = allStatus[relation.toStatId];
        fromItem.children.push({
          ...toItem,
          parentStatId: fromItem.id,
          relationId,
        });
        allStatus[toItem.id].parentStatId = fromItem.id;
        allStatus[toItem.id].relationId = relationId;
        allStatus[fromItem.id].relationId = relationId;
      });

      const nextTree: TreeItem[] = [];
      /**
       * 把没有父节点的 node push 到 tree 里面，其余过滤
       * 在上一步中，子节点都已经在对应的父节点中了
       */
      Object.keys(allStatus).forEach((statId) => {
        if (allStatus[statId].parentStatId === undefined) {
          nextTree.push(allStatus[statId]);
        }
      });

      /** 构建 tree 需要的数据结构 */
      const mapTree = (list: TreeItem[]): ComStatusTreeNode[] => {
        return list.map((item) => {
          return {
            key: item.id,
            title: item.name,
            children: mapTree(item.children),
            parentStatId: item.parentStatId,
            relationId: item.relationId,
          };
        });
      };

      return mapTree(nextTree);
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
          fromStatId: dropNode.key as string,
          toStatId: dragNode.key as string,
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
            fromStatId: dropNode.parentStatId as string,
            toStatId: dragNode.key as string,
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
