import { useModel } from '@umijs/max';
import { usePrevious, useUpdateLayoutEffect } from 'ahooks';
import { useState } from 'react';

const useSiderLeftMode = () => {
  /**
   * insert 点击舞台组件等待插入
   * normal 显示 页面，布局，资源等
   * components 组件市场
   */
  const [mode, setMode] = useState<'normal' | 'components' | 'insert'>(
    'normal',
  );

  const prevMode = usePrevious(mode);

  const { cleanFocusSlotsInert } = useModel('stage.slotsInsert', (model) => {
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
    setMode,
  };
};

export default useSiderLeftMode;
