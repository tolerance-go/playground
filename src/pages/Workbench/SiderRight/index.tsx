import { useModel } from '@umijs/max';
import { Col, Layout, Row, Tabs } from 'antd';
import consola from 'consola';
import { useState } from 'react';
import { ComsStatusTabs } from './ComsStatusTabs';
import { SettingForm } from './SettingForm';
import StatActionsList from './StatActionsList';
import StatActionsTab from './StatActionsTab';

const { TabPane } = Tabs;

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderRightMode');

  // const { activeVersionId } = useModel('versionList', (model) => {
  //   return {
  //     activeVersionId: model?.activeVersionId,
  //   };
  // });

  consola.info('渲染右侧面板');

  const [activeKey, setActiveKey] = useState('actions');

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
              <ComsStatusTabs />
            </Col>

            <Col flex={'none'}>
              <Tabs size="small" onChange={setActiveKey} activeKey={activeKey}>
                <TabPane tab="配置" key="settings"></TabPane>
                <TabPane tab="动作" key="actions"></TabPane>
                <TabPane tab="事件" key="2">
                  Content of Tab Pane 3
                </TabPane>
                <TabPane tab="外观" key="3">
                  Content of Tab Pane 3
                </TabPane>
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
                        <StatActionsTab />
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
                return <></>;
              })()}
            </Col>
          </Row>
        </>
      )}
    </Sider>
  );
}
