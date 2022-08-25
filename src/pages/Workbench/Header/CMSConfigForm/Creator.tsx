import { DatabaseControllerCreate } from '@/services/server/DatabaseController';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useModel, useSearchParams } from '@umijs/max';
import { Button, message } from 'antd';

export default () => {
  const [searchParams] = useSearchParams();

  const { pushData } = useModel('database.dataList', (model) => ({
    pushData: model.pushData,
  }));

  return (
    <ModalForm<{
      name: string;
      desc?: string;
    }>
      title="新建表单"
      trigger={<Button type="text" icon={<PlusOutlined />}></Button>}
      autoFocusFirstInput
      submitTimeout={2000}
      onFinish={async (values) => {
        const appId = searchParams.get('appId');

        if (!appId) {
          return message.warn('appId 未找到');
        }

        const { success, data } = await DatabaseControllerCreate({
          name: values.name,
          desc: values.desc,
          app_id: appId,
        });

        if (success) {
          if (!data) {
            message.warn('data 未正常返回');
            return success;
          }
          pushData(data);
          message.success('提交成功');
        }

        return success;
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="name"
        label="名称"
        placeholder="请输入名称"
      />
      <ProFormText name="desc" label="描述" placeholder="请输入描述" />
    </ModalForm>
  );
};
