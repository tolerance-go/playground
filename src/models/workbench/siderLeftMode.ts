import { useModel } from '@umijs/max';
import { useMemoizedFn, usePrevious, useUpdateLayoutEffect } from 'ahooks';
import { useState } from 'react';

export type SiderLeftMode = 'pages' | 'insert' | 'components';

const useSiderLeftMode = () => {
  /**
   * insert 点击舞台组件等待插入
   * normal 显示 页面，布局，资源等
   */
  const [siderLeftMode, setSiderLeftMode] = useState<SiderLeftMode>('pages');

  const prevMode = usePrevious(siderLeftMode);

  const { cleanFocusSlotsInert } = useModel('stage.slotsInsert', (model) => {
    return {
      cleanFocusSlotsInert: model.cleanFocusSlotsInert,
    };
  });

  const switchSiderLeftMode = useMemoizedFn((mode: SiderLeftMode) => {
    setSiderLeftMode(mode);
  });

  useUpdateLayoutEffect(() => {
    if (siderLeftMode !== 'insert' && prevMode === 'insert') {
      cleanFocusSlotsInert();
    }
  }, [siderLeftMode]);

  return {
    siderLeftMode,
    setSiderLeftMode,
    switchSiderLeftMode,
  };
};

export default useSiderLeftMode;
