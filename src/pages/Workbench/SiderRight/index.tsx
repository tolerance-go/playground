import { useModel } from '@umijs/max';
import { Col, Layout, Row, Tabs } from 'antd';
import { useState } from 'react';
import { ComInfo } from './ComInfo';
import { ComsStatusTabs } from './ComsStatusTabs';
import ComStatEvents from './ComStatEvents';
import { SettingForm } from './SettingForm';
import StatActionsCreator from './StatActionsCreator';
import StatActionsList from './StatActionsList';

const { TabPane } = Tabs;

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderRightMode');

  const [activeKey, setActiveKey] = useState('events');

  return (
    <Sider
      theme="light"
      width={320}
      style={{
        padding: '15px 10px 15px 15px',
      }}
    >
      {mode === 'normal' ? null : (
        <>
          <Row
            style={{
              flexDirection: 'column',
              height: '100%',
              alignItems: 'stretch',
            }}
            wrap={false}
          >
            <Col flex={'none'}>
              <ComInfo />
            </Col>
            <Col flex={'none'}>
              <ComsStatusTabs />
            </Col>

            <Col flex={'none'}>
              <Tabs size="small" onChange={setActiveKey} activeKey={activeKey}>
                <TabPane tab="配置" key="settings"></TabPane>
                <TabPane tab="动作" key="actions"></TabPane>
                <TabPane tab="事件" key="events"></TabPane>
                <TabPane tab="外观" key="styles"></TabPane>
              </Tabs>
            </Col>

            <Col flex={'auto'}>
              {(() => {
                if (activeKey === 'settings') {
                  return <SettingForm />;
                }
                if (activeKey === 'actions') {
                  return (
                    <Row
                      style={{
                        flexDirection: 'column',
                        height: '100%',
                        alignItems: 'stretch',
                      }}
                      wrap={false}
                    >
                      <Col
                        flex={'none'}
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        <StatActionsCreator />
                      </Col>
                      <Col
                        flex={'auto'}
                        style={{
                          overflowY: 'auto',
                          position: 'relative',
                        }}
                      >
                        <StatActionsList />
                      </Col>
                    </Row>
                  );
                }
                if (activeKey === 'events') {
                  return <ComStatEvents />;
                }
                return <></>;
              })()}
            </Col>
          </Row>
        </>
      )}
    </Sider>
  );
}
