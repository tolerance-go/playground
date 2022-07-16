import { useModel } from '@umijs/max';
import { Col, Divider, Layout, Row, Typography } from 'antd';
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

  return (
    <Sider
      ref={siderRef}
      theme="light"
      width={300}
      style={{
        overflowY: 'scroll',
      }}
    >
      {mode === 'normal' ? (
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
      ) : (
        <ComponentGrid siderRef={siderRef} />
      )}
    </Sider>
  );
}
