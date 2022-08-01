import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';

/** from 是被继承的，to 是继承者 */
export type ComStatRelation = {
  id: string;
  toStatId: string;
  fromStatId: string;
  /** 锁住的字段，不进行继承同步 */
  lockFields: Record<string, boolean>;
};

/**
 * key: relationId
 */
export type ComStatusRelations = Record<string, ComStatRelation>;

/**
 * 所有组件的所有状态下配置之间的关系
 * key: comId
 */
export type ComsStatusRelations = Record<string, ComStatusRelations>;

const statusRelations = () => {
  const [comsStatusRelations, setComsStatusRelations] =
    useState<ComsStatusRelations>({});

  /** 创建组件状态关系 */
  const createComStatRelation = useMemoizedFn(
    (comId: string, data: Omit<ComStatRelation, 'id'>) => {
      setComsStatusRelations(
        produce((draft) => {
          const relationId = nanoid();
          if (draft[comId]) {
            draft[comId][relationId] = {
              ...data,
              id: relationId,
            };
          } else {
            draft[comId] = {
              [relationId]: {
                ...data,
                id: relationId,
              },
            };
          }
        }),
      );
    },
  );

  /** 删除组件的状态关系 */
  const deleteComStatRelation = useMemoizedFn(
    (comId: string, relationId: string) => {
      setComsStatusRelations(
        produce((draft) => {
          if (draft[comId]) {
            delete draft[comId][relationId];
          }
        }),
      );
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsStatusRelations,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { comsStatusRelations: ComsStatusRelations }) => {
      setComsStatusRelations(from?.comsStatusRelations ?? {});
    },
  );

  /** 找到所有继承该组件状态的状态 */
  const getComExtendRelationsFromStat = useMemoizedFn(
    (comId: string, fromStatId: string) => {
      return Object.keys(comsStatusRelations[comId])
        .filter((relationId) => {
          const relation = comsStatusRelations[comId][relationId];
          return relation.fromStatId === fromStatId;
        })
        .map((relationId) => comsStatusRelations[comId][relationId]);
    },
  );

  /** 获取组件状态的继承锁定字段（不同步修改） */
  const getStatLockFields = useMemoizedFn(
    (comId: string, relationId: string) => {
      return comsStatusRelations[comId]?.[relationId].lockFields;
    },
  );

  /** 将组件的继承字段锁起来 */
  const lockComExtendField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].lockFields[fieldName] = true;
        }),
      );
    },
  );

  /** 将组件的继承字段解锁 */
  const unlockComExtendField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].lockFields[fieldName] = false;
        }),
      );
    },
  );

  return {
    comsStatusRelations,
    getStatLockFields,
    lockComExtendField,
    unlockComExtendField,
    getComExtendRelationsFromStat,
    initData,
    getData,
    deleteComStatRelation,
    createComStatRelation,
    setComsStatusRelations,
  };
};

export default statusRelations;
