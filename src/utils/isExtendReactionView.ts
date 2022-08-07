import { UnsyncFields } from '@/models/statusRelations';

/** 是否显示动作行为展示，而非编辑 */
export const isExtendReactionView = (
  extendRelationToStatId: string | undefined,
  extendRelationLockFields: UnsyncFields | undefined,
  selectedComponentStatusId: string | undefined,
  name: string,
) => {
  return (
    extendRelationToStatId === selectedComponentStatusId &&
    !extendRelationLockFields?.[name]
  );
};
