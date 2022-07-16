import { CloudServerOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Alert, Button, message } from 'antd';
import dayjs from 'dayjs';

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
      title="API 配置管理"
      trigger={
        <Button type="text" icon={<CloudServerOutlined />}>
          API
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
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="name"
        label="接口文档地址"
        placeholder="请输入名称"
        initialValue={'http://127.0.0.1:7001/swagger-doc'}
        tooltip="目前仅支持 swagger"
      />
      <Alert
        message="同步成功"
        description={
          <div>
            {`最近一次同步时间：${dayjs().format(
              'YYYY-MM-DD HH:mm:ss，接口已作为额外选项出现在配置面板中',
            )}`}
          </div>
        }
        type="success"
        showIcon
      />
    </ModalForm>
  );
};
