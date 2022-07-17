import { useModel } from '@umijs/max';
import { Alert, Col, Divider, Layout, Row, Typography } from 'antd';
import consola from 'consola';
import { useRef } from 'react';
import ComponentGrid from './ComponentGrid';
import { PageCreator } from './PageCreator';
import PageNav from './PageNav';
import Segmented from './Segmented';

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderLeftMode');
  const bottomRef = useRef<HTMLDivElement>(null);
  const siderRef = useRef<HTMLDivElement>(null);

  consola.info('siderLeftMode mode 变化', mode);

  const renderContent = () => {
    if (mode === 'normal') {
      return (
        <Row
          style={{
            flexDirection: 'column',
            height: '100%',
            alignItems: 'stretch',
            padding: 15,
          }}
          wrap={false}
        >
          <Col flex={'none'}>
            <Segmented />
          </Col>
          <Col flex={'none'}>
            <Divider
              style={{
                marginTop: 15,
                marginBottom: 15,
              }}
            ></Divider>
          </Col>
          <Col flex={'none'}>
            <Row
              justify="space-between"
              align="middle"
              style={{
                background: '#fff',
                paddingBottom: 15,
              }}
            >
              <Col>
                <Typography.Text
                  style={{
                    fontSize: 14,
                  }}
                  strong
                >
                  路径
                </Typography.Text>
              </Col>
              <Col>
                <PageCreator />
              </Col>
            </Row>
          </Col>
          <Col
            flex={'auto'}
            style={{
              overflowY: 'scroll',
              position: 'relative',
            }}
            ref={bottomRef}
          >
            <PageNav />
          </Col>
        </Row>
      );
    }

    if (mode === 'insert' || mode === 'components') {
      return <ComponentGrid siderRef={siderRef} />;
    }

    return null;
  };

  return (
    <Sider
      ref={siderRef}
      theme="light"
      width={300}
      style={{
        overflowY: 'scroll',
      }}
    >
      {mode === 'insert' && (
        <Alert showIcon banner message="当前正在填充插槽" type="info" />
      )}
      {renderContent()}
    </Sider>
  );
}
