import { useModel } from '@umijs/max';
import { usePrevious, useUpdateLayoutEffect } from 'ahooks';
import { useState } from 'react';

export type NormalStatus = 'page' | 'layout' | 'asset';

const useSiderLeftMode = () => {
  /**
   * insert 点击舞台组件等待插入
   * normal 显示 页面，布局，资源等
   * components 组件市场
   */
  const [mode, setMode] = useState<'normal' | 'components' | 'insert'>(
    'normal',
  );
  const [normalStatus, setNormalStatus] = useState<NormalStatus>('page');

  const prevMode = usePrevious(mode);

  const { cleanFocusSlotsInert } = useModel('slotsInsert', (model) => {
    return {
      cleanFocusSlotsInert: model?.cleanFocusSlotsInert,
    };
  });

  useUpdateLayoutEffect(() => {
    if (mode !== 'insert' && prevMode === 'insert') {
      cleanFocusSlotsInert();
    }
  }, [mode]);

  return {
    mode,
    normalStatus,
    setNormalStatus,
    setMode,
  };
};

export default useSiderLeftMode;
