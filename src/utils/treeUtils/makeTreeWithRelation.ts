import { RelationId } from '@/typings/keys';
import utl from 'lodash';

export type Relation = {
  id: string;
  toId: string;
  fromId: string;
};

export type Relations = Record<RelationId, Relation>;

export type RelationTreeItem<T> = T & {
  parentId?: string | number;
  children?: RelationTreeItem<T>[];
  relationId?: string;
};

/** 使用关系和列表构建一棵树结构 */
export const makeTreeWithRelation = <
  I extends {
    id: string | number;
    [key: string]: any;
  },
>(
  items: Record<string, I>,
  relations: Relations,
) => {
  /** 先克隆所有状态 */
  const clonedItems: Record<string, RelationTreeItem<I>> = utl.mapValues(
    items,
    (val) => ({
      ...val,
    }),
  );

  /** 把所有状态的子节点填充满 */
  Object.keys(relations).forEach((relationId) => {
    const relation = relations[relationId];
    const fromItem = clonedItems[relation.fromId];
    const toItem = clonedItems[relation.toId];

    clonedItems[toItem.id].parentId = fromItem.id;
    clonedItems[toItem.id].relationId = relationId;
    clonedItems[fromItem.id].relationId = relationId;

    fromItem.children = fromItem.children
      ? fromItem.children.concat(clonedItems[toItem.id])
      : /**
         * 注意这里是引用，可能后续还有对他的操作
         * 不用担心不可变，之前已经全部 clone 过了
         */
        [clonedItems[toItem.id]];
  });

  const nextTree: RelationTreeItem<I>[] = [];
  /**
   * 把没有父节点的 node push 到 tree 里面，其余过滤
   * 在上一步中，子节点都已经在对应的父节点中了
   */
  Object.keys(clonedItems).forEach((id) => {
    if (clonedItems[id].parentId === undefined) {
      nextTree.push(clonedItems[id]);
    }
  });
  return nextTree;
};
