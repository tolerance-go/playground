import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { useState } from 'react';

export type StatusSettingsDefaults = Record<string, string>;

/** 每个组件的默认应用状态 */
const statusSettingsDefaults = () => {
  const [statusSettingsDefaults, setStatusSettingsDefaults] =
    useState<StatusSettingsDefaults>({});

  /** 设置组件的默认状态 */
  const setComStatusSettingsDefaults = useMemoizedFn(
    (comId: string, defaultStatId: string) => {
      setStatusSettingsDefaults(
        produce((draft) => {
          draft[comId] = defaultStatId;
        }),
      );
    },
  );

  const { setSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      setSelectedComponentStatusId: model.setSelectedComponentStatusId,
    }),
  );

  /** 设置组件的默认状态为全局右侧面板选中状态 */
  const selectRightPanelComStatusIdFromDefault = useMemoizedFn(
    (comId: string) => {
      const defaultStatId = statusSettingsDefaults[comId];
      setSelectedComponentStatusId(defaultStatId);
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      statusSettingsDefaults,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { statusSettingsDefaults: StatusSettingsDefaults }) => {
      setStatusSettingsDefaults(from?.statusSettingsDefaults ?? {});
    },
  );

  /** 清空组件的默认配置 */
  const cleanComDefautStat = useMemoizedFn((comId: string) => {
    setStatusSettingsDefaults(
      produce((draft) => {
        delete draft[comId];
      }),
    );
  });

  const getComDefaultStatId = useMemoizedFn((comId: string) => {
    return statusSettingsDefaults[comId];
  });

  return {
    statusSettingsDefaults,
    getComDefaultStatId,
    initData,
    getData,
    cleanComDefautStat,
    setComStatusSettingsDefaults,
    selectRightPanelComStatusIdFromDefault,
  };
};

export default statusSettingsDefaults;
