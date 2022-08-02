import { useModel } from '@umijs/max';
import { Layout, Tabs } from 'antd';
import consola from 'consola';
import { ComsStatusTabs } from './ComsStatusTabs';
import { SettingForm } from './SettingForm';
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
          <ComsStatusTabs />
          <Tabs size="small" defaultActiveKey="action">
            <TabPane tab="配置" key="1">
              <SettingForm />
            </TabPane>
            <TabPane tab="动作" key="action">
              <StatActionsTab />
              {/* <StatActionsList /> */}
            </TabPane>
            <TabPane tab="事件" key="2">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="外观" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </>
      )}
    </Sider>
  );
}
