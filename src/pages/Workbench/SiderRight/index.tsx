import { DiscussInfos } from '@/components/DiscussInfos';
import { useModel } from '@umijs/max';
import { Col, Layout, Row, Tabs } from 'antd';
import { useState } from 'react';
import { ComInfo } from './ComInfo';
import { ComsStatusTabs } from './ComsStatusTabs';
import ComStatEvents from './ComStatEvents';
import ComStatStyle from './ComStatStyle';
import { SettingForm } from './SettingForm';
import StatActionsCreator from './StatActionsCreator';
import StatActionsList from './StatActionsList';

const { TabPane } = Tabs;

const { Sider } = Layout;

export default function App() {
  const { siderRightMode } = useModel('workbench.siderRightMode', (model) => ({
    siderRightMode: model.mode,
  }));
  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));

  const [activeKey, setActiveKey] = useState('settings');

  const renderContent = () => {
    if (stageMode === 'playground') {
      return (
        <div
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            paddingRight: 10,
            height: '100%',
          }}
        >
          <DiscussInfos />
        </div>
      );
    }

    return siderRightMode === 'normal' ? null : (
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
              <TabPane tab="外观" key="styles"></TabPane>
              <TabPane tab="动作" key="actions"></TabPane>
              <TabPane tab="事件" key="events"></TabPane>
            </Tabs>
          </Col>

          <Col
            flex={'auto'}
            style={{
              overflowY: 'auto',
            }}
          >
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

              if (activeKey === 'styles') {
                return <ComStatStyle />;
              }
              return <></>;
            })()}
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Sider
      theme="light"
      width={320}
      style={{
        padding: stageMode === 'playground' ? undefined : '15px 10px 15px 15px',
        borderLeft: '1px solid rgb(242, 242, 242)',
        overflowY: 'auto',
      }}
    >
      {renderContent()}
    </Sider>
  );
}
