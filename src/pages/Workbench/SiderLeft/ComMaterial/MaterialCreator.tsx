import { ComMaterial } from '@/models/comsMaterialList';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';

export default () => {
  const { createComMaterial } = useModel('comsMaterialList', (model) => ({
    createComMaterial: model.createComMaterial,
  }));

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  return (
    <ModalForm<
      Omit<ComMaterial, 'rootIds'> & {
        rootId: string;
      }
    >
      title="新建物料"
      trigger={<PlusOutlined />}
      autoFocusFirstInput
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values.name);
        message.success('提交成功');
        createComMaterial(values.name, [values.rootId], values.desc);
        triggerPrepareSaveTimeChange();
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
        label="名称"
        placeholder="请输入名称"
      />
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="rootId"
        label="组件 ID"
        placeholder="请输入 ID"
      />
      <ProFormText name="desc" label="描述" placeholder="请输入描述" />
    </ModalForm>
  );
};
