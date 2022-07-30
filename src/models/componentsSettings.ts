import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

type ComsSettings = Record<string, object>;

/** 当前舞台上所有组件对应的配置 */
const useComponentsSettings = () => {
  const [settings, setSettings] = useState<ComsSettings>({});

  const setComponentSettings = useMemoizedFn((id: string, settings: object) => {
    setSettings((prev) => ({
      ...prev,
      [id]: settings,
    }));
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

  /** 删除组件配置 */
  const removeComSettings = useMemoizedFn((id: string) => {
    setSettings((prev) => {
      delete prev?.[id];
      return { ...prev };
    });
  });

  return {
    settings,
    getData,
    setComponentSettings,
    initData,
    removeComSettings,
  };
};

export default useComponentsSettings;
