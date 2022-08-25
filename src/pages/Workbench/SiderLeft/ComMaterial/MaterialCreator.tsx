import { useDeleteComsFromStage } from '@/hooks/actions/useDeleteComsFromStage';
import { useGetSliceStageData } from '@/hooks/initials/useGetSliceStageData';
import { ComponentControllerCreate } from '@/services/server/ComponentController';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import qs from 'qs';

export default () => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const { appId } = query;
  const { createComMaterial } = useModel('component.componentList', (model) => ({
    createComMaterial: model.createComMaterial,
  }));

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const { deleteComsFromStage } = useDeleteComsFromStage();

  const { getSliceStageData } = useGetSliceStageData();

  return (
    <ModalForm<{
      name: string;
      rootId: string;
      desc?: string;
    }>
      title="新建物料"
      trigger={<PlusOutlined />}
      autoFocusFirstInput
      submitTimeout={2000}
      onFinish={async (values) => {
        const stageData = getSliceStageData([values.rootId]);

        const { success, data } = await ComponentControllerCreate({
          name: values.name,
          desc: values.desc,
          app_id: appId as string,
          stage_data: JSON.stringify(stageData),
        });

        if (success) {
          message.success('提交成功');
          createComMaterial(data!);
          deleteComsFromStage([values.rootId]);
          triggerPrepareSaveTimeChange();
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
