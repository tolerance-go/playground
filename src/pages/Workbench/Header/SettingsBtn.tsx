import { SettingOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  return (
    <ModalForm
      title="设置"
      trigger={
        <Button type="text" icon={<SettingOutlined />}>
          设置
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        width: '30%',
      }}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values.name);
        message.success('同步成功');
        return true;
      }}
    >
      {/* <ProCard title="环境配置" bordered={false} collapsible>
        <ProFormText
          name="name"
          label="演示环境"
          placeholder="请输入地址"
          tooltip="也称为开发环境，点击演示后应用的地址"
        />
        <ProFormText
          name="name"
          label="发布环境"
          placeholder="请输入地址"
          tooltip="也称为预生产环境，点击发布后应用的地址"
        />
      </ProCard> */}
    </ModalForm>
  );
};
