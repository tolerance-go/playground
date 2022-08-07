import { ComId, RelationId } from '@/typings/keys';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';

export type LockFields = Record<string, boolean>;

/** from 是被继承的，to 是继承者 */
export type ComStatRelation = {
  id: string;
  toStatId: string;
  fromStatId: string;
  /** 锁住的字段，不进行继承同步 */
  settingLockFields: LockFields;
  /** 样式锁 */
  styleLockFields: LockFields;
  /** 动作锁 */
  actionLockFields: LockFields;
  /** 事件锁 */
  eventLockFields: LockFields;
};

/**
 * key: relationId
 */
export type ComStatusRelations = Record<RelationId, ComStatRelation>;

/**
 * 所有组件的所有状态下配置之间的关系
 * key: comId
 */
export type ComsStatusRelations = Record<ComId, ComStatusRelations>;

const useStatusRelations = () => {
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

  /** 根据 toStatId 删除关系 */
  const deleteComStatRelationFromToStatId = useMemoizedFn(
    (comId: string, toStatId: string) => {
      Object.keys(comsStatusRelations[comId]).forEach((relationId) => {
        const relation = comsStatusRelations[comId][relationId];
        if (relation.toStatId === toStatId) {
          deleteComStatRelation(comId, relation.id);
        }
      });
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
      return Object.keys(comsStatusRelations[comId] ?? {})
        .filter((relationId) => {
          const relation = comsStatusRelations[comId][relationId];
          return relation.fromStatId === fromStatId;
        })
        .map((relationId) => comsStatusRelations[comId][relationId]);
    },
  );

  /** 获取组件状态的继承锁定字段（不同步修改） */
  const getStatLockSettingFields = useMemoizedFn(
    (comId: string, relationId: string) => {
      return comsStatusRelations[comId]?.[relationId].settingLockFields;
    },
  );

  const getStatLockStyleFields = useMemoizedFn(
    (comId: string, relationId: string) => {
      return comsStatusRelations[comId]?.[relationId].styleLockFields;
    },
  );

  const getStatLockActionFields = useMemoizedFn(
    (comId: string, relationId: string) => {
      return comsStatusRelations[comId]?.[relationId].actionLockFields;
    },
  );

  const getStatLockEventFields = useMemoizedFn(
    (comId: string, relationId: string) => {
      return comsStatusRelations[comId]?.[relationId].eventLockFields;
    },
  );

  /** 将组件的继承字段锁起来 */
  const lockComExtendSettingField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].settingLockFields[fieldName] = true;
        }),
      );
    },
  );

  /** 将组件的继承字段解锁 */
  const unlockComExtendSettingField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].settingLockFields[fieldName] = false;
        }),
      );
    },
  );

  /** 将组件的继承字段锁起来 */
  const lockComExtendStyleField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].styleLockFields[fieldName] = true;
        }),
      );
    },
  );

  /** 将组件的继承字段解锁 */
  const unlockComExtendStyleField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].styleLockFields[fieldName] = false;
        }),
      );
    },
  );

  const lockComExtendActionField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].actionLockFields[fieldName] = true;
        }),
      );
    },
  );

  const unlockComExtendActionField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].actionLockFields[fieldName] = false;
        }),
      );
    },
  );

  const lockComExtendEventField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].eventLockFields[fieldName] = true;
        }),
      );
    },
  );

  const unlockComExtendEventField = useMemoizedFn(
    (comId: string, relationId: string, fieldName: string) => {
      setComsStatusRelations(
        produce((draft) => {
          draft[comId][relationId].eventLockFields[fieldName] = false;
        }),
      );
    },
  );

  return {
    comsStatusRelations,
    getStatLockEventFields,
    getStatLockActionFields,
    deleteComStatRelationFromToStatId,
    lockComExtendEventField,
    unlockComExtendEventField,
    lockComExtendActionField,
    unlockComExtendActionField,
    getStatLockStyleFields,
    lockComExtendStyleField,
    unlockComExtendStyleField,
    getStatLockSettingFields,
    lockComExtendSettingField,
    unlockComExtendSettingField,
    getComExtendRelationsFromStat,
    initData,
    getData,
    deleteComStatRelation,
    createComStatRelation,
    setComsStatusRelations,
  };
};

export default useStatusRelations;
