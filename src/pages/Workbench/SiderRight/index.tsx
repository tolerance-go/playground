import { useModel } from '@umijs/max';
import { Layout, Tabs } from 'antd';
import consola from 'consola';
import { useEffect, useRef } from 'react';
import CreateComStatus, { CreateComStatusAPI } from './CreateComStatus';
import { SettingForm } from './SettingForm';
const { TabPane } = Tabs;

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderRightMode');

  const { setSelectNodeId, stageSelectNodeId } = useModel(
    'stageSelectNode',
    (model) => ({
      setSelectNodeId: model?.setStageSelectNodeId,
      stageSelectNodeId: model?.stageSelectNodeId,
    }),
  );

  const { activeVersionId } = useModel('versionList', (model) => {
    return {
      activeVersionId: model?.activeVersionId,
    };
  });

  const { componentsStatus } = useModel('statusSettings', (model) => ({
    componentsStatus: model.componentsStatus,
  }));

  debugger;

  const createFormRef = useRef<CreateComStatusAPI>(null);

  consola.info('渲染右侧面板');

  /**
   * versionId 切换的时候，清空选中的舞台组件
   * 之前放在 SettingForm 中，导致点击后 mode 变化
   * SettingForm 重新渲染，useEffect 反复执行，所以
   * 放到上面一层组件
   */
  useEffect(() => {
    consola.info('版本切换清空选中组件', 'activeVersionId', activeVersionId);
    setSelectNodeId(undefined);
  }, [activeVersionId]);

  return (
    <Sider
      theme="light"
      width={320}
      style={{
        padding: '15px 10px 15px 15px',
      }}
    >
      <Tabs
        size="small"
        type="editable-card"
        addIcon={<CreateComStatus ref={createFormRef} />}
      >
        {stageSelectNodeId && componentsStatus[stageSelectNodeId] ? (
          Object.keys(componentsStatus[stageSelectNodeId]).map((statusId) => {
            const componentStatus =
              componentsStatus[stageSelectNodeId][statusId];
            return (
              <TabPane tab={componentStatus.name} key={statusId}>
                Content of Tab Pane 3
              </TabPane>
            );
          })
        ) : (
          <></>
        )}
      </Tabs>

      <Tabs size="small" defaultActiveKey="1">
        <TabPane tab="配置" key="1">
          {mode === 'normal' ? null : <SettingForm />}
        </TabPane>
        <TabPane tab="事件" key="2">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="外观" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </Sider>
  );
}
