import { useModel } from '@umijs/max';
import { Layout } from 'antd';
import consola from 'consola';
import { useEffect } from 'react';
import { SettingForm } from './SettingForm';

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderRightMode');

  const { setSelectNodeId } = useModel('selectNodeMeta', (model) => ({
    setSelectNodeId: model.setSelectNodeId,
  }));

  const { activeVersionId } = useModel('versionList', (model) => {
    return {
      activeVersionId: model.activeVersionId,
    };
  });

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
      width={300}
      style={{
        padding: '15px 10px 15px 15px',
      }}
    >
      {mode === 'normal' ? null : <SettingForm />}
    </Sider>
  );
}
