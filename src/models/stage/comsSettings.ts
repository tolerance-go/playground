import { ComId, StatId } from '@/typings/keys';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import utl from 'lodash';
import { useState } from 'react';

export type ComponentSetting = Record<string, any>;

/**
 * 组件的不同状态
 * key: statId
 */
export type ComponentStatusSettings = Record<StatId, ComponentSetting>;

/** 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsSettings = Record<ComId, ComponentStatusSettings>;

/** 组件外观 */
const useComsSettings = () => {
  const [comsSettings, setComsSettings] = useState<ComponentsSettings>({});

  const { getSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  const setComStatSetting = useMemoizedFn(
    (comId: string, statId: string, setting: ComponentSetting) => {
      setComsSettings(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][statId] = setting;
        }),
      );
    },
  );

  const updateComStatSetting = useMemoizedFn(
    (comId: string, statId: string, setting: Partial<ComponentSetting>) => {
      setComsSettings(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][statId] = {
            ...draft[comId][statId],
            ...setting,
          };
        }),
      );
    },
  );

  /** 设置组件当前状态下的配置 */
  const setSelectedComSettings = useMemoizedFn((settings: object) => {
    const selectedComponentStatusId = getSelectedComponentStatusId();
    const stageSelectNodeId = getStageSelectNodeId();

    if (stageSelectNodeId && selectedComponentStatusId) {
      setComStatSetting(stageSelectNodeId, selectedComponentStatusId, settings);
    }
  });

  /** 拷贝组件 A 状态的配置到 B 状态 */
  const copyComSettingFromStatToOtherStat = useMemoizedFn(
    (comId: string, fromStatId: string, toStatId: string) => {
      setComsSettings(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][toStatId] = draft[comId][fromStatId];
        }),
      );
    },
  );

  const copySelectedComSettingFromActiveStatToOtherStat = useMemoizedFn(
    (toStatId: string) => {
      const stageSelectNodeId = getStageSelectNodeId();
      const selectedComponentStatusId = getSelectedComponentStatusId();
      if (stageSelectNodeId && selectedComponentStatusId) {
        copyComSettingFromStatToOtherStat(
          stageSelectNodeId,
          selectedComponentStatusId,
          toStatId,
        );
      }
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsSettings,
    };
  });

  const getSliceData = useMemoizedFn((comIds: string[]) => {
    return {
      comsSettings: utl.pick(comsSettings, comIds),
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { comsSettings: ComponentsSettings }) => {
      setComsSettings(from?.comsSettings ?? {});
    },
  );

  const deleteComsSettingsByIds = useMemoizedFn((comIds: string[]) => {
    setComsSettings(
      produce((draft) => {
        comIds.forEach((comId) => {
          delete draft[comId];
        });
      }),
    );
  });

  return {
    comsSettings,
    deleteComsSettingsByIds,
    getSliceData,
    copyComSettingFromStatToOtherStat,
    copySelectedComSettingFromActiveStatToOtherStat,
    setSelectedComSettings,
    getData,
    initData,
    setComStatSetting,
    updateComStatSetting,
  };
};

export default useComsSettings;
