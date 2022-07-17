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
  return {
    mode,
    setMode,
  };
};

export default useSiderLeftMode;
