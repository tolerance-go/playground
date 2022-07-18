import Stage from '@/components/Stage';
import { useModel } from '@umijs/max';
import { Layout } from 'antd';

const { Content } = Layout;

export default () => {
  const { setMode } = useModel('siderLeftMode', (mode) => ({
    setMode: mode.setMode,
  }));

  return (
    <Content
      style={{
        overflow: 'auto',
      }}
      onClick={() => {
        /** 点击舞台，回复左边栏状态 */
        setMode('normal');
      }}
    >
      <Stage />
    </Content>
  );
};
