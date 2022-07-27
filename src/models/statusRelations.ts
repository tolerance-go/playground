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

  return {
    comsStatusRelations,
    setComsStatusRelations,
  };
};

export default statusRelations;
