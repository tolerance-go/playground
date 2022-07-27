import { useSelectedComponentStatus } from '@/hooks/useSelectedComponentStatus';
import { ComponentStat } from '@/models/statusSettings';
import { useModel } from '@umijs/max';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import utl from 'lodash';
import { useMemo } from 'react';

export const ComStatusTreeMap = () => {
  const { status } = useSelectedComponentStatus();

  const { comsStatusRelations } = useModel('statusRelations', (model) => ({
    comsStatusRelations: model.comsStatusRelations,
  }));
  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const treeData = useMemo(() => {
    if (stageSelectNodeId && status) {
      type TreeItem = ComponentStat & {
        parentStatId?: string;
        children: TreeItem[];
      };

      const comStatusRelations = comsStatusRelations[stageSelectNodeId] ?? {};
      const allStatus = utl.mapValues(status, (val) => ({
        ...val,
        parentStatId: undefined,
        children: [] as TreeItem[],
      }));
      Object.keys(comStatusRelations).forEach((relationId) => {
        const relation = comStatusRelations[relationId];
        const fromItem = allStatus[relation.fromStatId];
        const toItem = allStatus[relation.toStatId];
        fromItem.children.push({
          ...toItem,
          parentStatId: fromItem.id,
        });
      });

      const nextTree: TreeItem[] = [];
      Object.keys(allStatus).forEach((statId) => {
        if (
          allStatus[statId].children.length ||
          allStatus[statId].parentStatId === undefined
        ) {
          nextTree.push(allStatus[statId]);
        }
      });

      const mapTree = (list: TreeItem[]): DataNode[] => {
        return list.map((item) => {
          return {
            key: item.id,
            title: item.name,
            children: mapTree(item.children),
          };
        });
      };

      return mapTree(nextTree);
    }
    return [];
  }, [status]);

  return <Tree draggable blockNode selectable treeData={treeData} />;
};
