import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';

type ComStatRelation = {
  toStatId: string;
  fromStatId: string;
  syncFields: Record<string, boolean>;
};

type ComStatusRelations = Record<string, ComStatRelation>;

/** 所有组件的所有状态下配置之间的关系 */
export type ComsStatusRelations = Record<string, ComStatusRelations>;

const statusRelations = () => {
  const [comsStatusRelations, setComsStatusRelations] =
    useState<ComsStatusRelations>({});

  /** 创建组件状态关系 */
  const createComStatRelation = useMemoizedFn(
    (comId: string, data: ComStatRelation) => {
      setComsStatusRelations(
        produce((draft) => {
          const relationId = nanoid();
          if (draft[comId]) {
            draft[comId][relationId] = data;
          } else {
            draft[comId] = {
              [relationId]: data,
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

  return {
    comsStatusRelations,
    initData,
    getData,
    deleteComStatRelation,
    createComStatRelation,
    setComsStatusRelations,
  };
};

export default statusRelations;
