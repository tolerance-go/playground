import Stage from '@/components/Stage';
import { useModel } from '@umijs/max';
import { Layout } from 'antd';

const { Content } = Layout;

export default () => {
  const { setMode } = useModel('siderLeftMode', (model) => ({
    setMode: model?.setMode,
  }));

  return (
    <Content
      style={{
        overflow: 'auto',
        background: '#f0f2f5',
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
