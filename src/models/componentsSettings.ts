import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

/** 当前舞台上所有组件对应的配置 */
const useComponentsSettings = () => {
  const [settings, setSettings] = useState<Record<string, object>>({});

  /** 新增组建到舞台 */
  const setComponentSettings = useMemoizedFn((id: string, settings: object) => {
    setSettings((prev) => ({
      ...prev,
      [id]: settings,
    }));
  });

  return {
    settings,
    setSettings,
    setComponentSettings,
  };
};

export default useComponentsSettings;
