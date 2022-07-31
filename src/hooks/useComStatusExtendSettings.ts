import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import utl from 'lodash';

/** 组件继承状态修改 */
export const useComStatusExtendSettings = () => {
  const { setComStatSettings } = useModel('statusSettings', (model) => ({
    setComStatSettings: model.setComStatSettings,
  }));

  const { getComExtendStatusFromStat, getStatLockFields } = useModel(
    'statusRelations',
    (model) => ({
      getComExtendStatusFromStat: model.getComExtendRelationsFromStat,
      getStatLockFields: model.getStatLockFields,
    }),
  );

  const { getSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  /** 设置组件配置和所有继承该配置的组件配置 */
  const setComSettingsExtendsSettings = useMemoizedFn(
    (comId: string, statId: string, settings: object) => {
      setComStatSettings(comId, statId, settings);

      const extendRelations = getComExtendStatusFromStat(comId, statId);
      extendRelations.forEach((relation) => {
        const lockFields = getStatLockFields(comId, relation.id);
        const filtedSettings = utl.omit(
          settings,
          lockFields
            ? Object.keys(lockFields).filter((field) => lockFields[field])
            : [],
        );
        setComStatSettings(
          comId,
          relation.toStatId,
          // 锁住的字段，不进行继承同步，在这里过滤掉
          filtedSettings,
        );
      });
    },
  );

  const setCurrentComSettingsExtendsSettings = useMemoizedFn(
    (settings: object) => {
      const selectedComponentStatusId = getSelectedComponentStatusId();
      const stageSelectNodeId = getStageSelectNodeId();

      if (stageSelectNodeId && selectedComponentStatusId) {
        setComSettingsExtendsSettings(
          stageSelectNodeId,
          selectedComponentStatusId,
          settings,
        );
      }
    },
  );

  return {
    setCurrentComSettingsExtendsSettings,
    setComSettingsExtendsSettings,
  };
};
