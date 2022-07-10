import { useModel } from '@umijs/max';
import { Layout } from 'antd';
import consola from 'consola';
import { SettingForm } from './SettingForm';

const { Sider } = Layout;

export default function App() {
  const { mode } = useModel('siderRightMode');

  consola.info('渲染右侧面板');

  return (
    <Sider
      theme="light"
      width={300}
      style={{
        padding: 10,
      }}
    >
      {mode === 'normal' ? null : <SettingForm />}
    </Sider>
  );
}
