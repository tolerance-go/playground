import { Layout } from 'antd';
import Center from './Center';
import Global from './Global';
import Header from './Header';
import { HistoryRevertor } from './HistoryRevertor';
import SiderLeft from './SiderLeft';
import SiderRight from './SiderRight';

export default function App() {
  return (
    <HistoryRevertor>
      <Layout>
        <Global />
        <Header />
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
    </HistoryRevertor>
  );
}
