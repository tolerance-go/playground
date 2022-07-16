import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

type ComsSettings = Record<string, object>;

/** 当前舞台上所有组件对应的配置 */
const useComponentsSettings = () => {
  const [settings, setSettings] = useState<ComsSettings>({});

  const { refreshLastAutoSaveTime } = useModel('stageAutoSave', (model) => {
    return {
      refreshLastAutoSaveTime: model.triggerSaveTimeChange,
    };
  });

  const setComponentSettings = useMemoizedFn((id: string, settings: object) => {
    setSettings((prev) => ({
      ...prev,
      [id]: settings,
    }));

    refreshLastAutoSaveTime();
  });

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      settings,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn((from?: { settings: ComsSettings }) => {
    setSettings(from?.settings ?? {});
  });

  return {
    settings,
    getData,
    setComponentSettings,
    initData,
  };
};

export default useComponentsSettings;
