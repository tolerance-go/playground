import { Layout } from 'antd';
import Center from './Center';
import Executor from './Executor';
import HeaderInner from './Header';
import SiderLeft from './SiderLeft';
import SiderRight from './SiderRight';

const { Header } = Layout;

export default function App() {
  return (
    <Layout>
      <Executor />
      <Header
        style={{
          background: '#fff',
          borderBottom: '1px solid #f2f2f2',
          padding: '0px 10px',
          /** 原本 64 会影响内部元素高度 */
          lineHeight: 'normal',
        }}
      >
        <HeaderInner />
      </Header>
      <Layout
        style={{
          height: 'calc(100vh - 64px)',
        }}
      >
        <SiderLeft />
        <Center />
        <SiderRight />
      </Layout>
    </Layout>
  );
}
