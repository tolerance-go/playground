import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Col, Layout, Row, Typography } from 'antd';
import ComponentGrid from './ComponentGrid';
import PageNav from './PageNav';
import Segmented from './Segmented';

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderLeftMode');

  return (
    <Sider
      theme="light"
      width={300}
      style={{
        overflowY: 'scroll',
      }}
    >
      {mode === 'normal' ? (
        <div
          style={{
            padding: 10,
          }}
        >
          <Segmented />
          <Row
            justify="space-between"
            style={{
              marginTop: 15,
            }}
          >
            <Col>
              <Typography.Title level={5}>路径</Typography.Title>
            </Col>
            <Col>
              <PlusOutlined />
            </Col>
          </Row>
          <PageNav />
        </div>
      ) : (
        <ComponentGrid />
      )}
    </Sider>
  );
}
