import { ConfigsForm } from '@/components/ConfigsForm';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form } from 'antd';
import { nanoid } from 'nanoid';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const { comsActionsConfigs } = useModel('comsActionsConfigs', (model) => ({
    comsActionsConfigs: model.comsActionsConfigs,
  }));

  const { stageSelectNode } = useSelectedNode();

  const selectedcomsActionsConfigs = stageSelectNode?.type
    ? comsActionsConfigs[stageSelectNode.type]
    : undefined;

  const [form] = Form.useForm();
  const [settingsForm] = Form.useForm();

  const { createComStatAction } = useModel('comsActions', (model) => ({
    createComStatAction: model.createComStatAction,
  }));

  const { getStageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  const { getSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  return (
    <ModalForm
      form={form}
      title="新建动作"
      trigger={
        <Button block size="small">
          添加动作
        </Button>
      }
      autoFocusFirstInput
      onFinish={async ({ type, name }) => {
        const selectedComId = getStageSelectNodeId();
        const selectedComStatId = getSelectedComponentStatusId();
        if (selectedComId && selectedComStatId) {
          createComStatAction(selectedComId, selectedComStatId, {
            id: nanoid(),
            type,
            name,
            settings: settingsForm.getFieldsValue(),
          });
        }
        return true;
      }}
    >
      <ProFormText name="name" label="动作名称" placeholder="请输入" />
      <ProFormSelect
        name="type"
        label="动作类型"
        placeholder="请选择"
        options={selectedcomsActionsConfigs?.map((item) => ({
          label: item.name,
          value: item.type,
        }))}
      />
      <ProFormDependency name={['type']}>
        {({ type }) => {
          const config = selectedcomsActionsConfigs?.find(
            (item) => item.type === type,
          );
          return (
            <ConfigsForm
              form={settingsForm}
              configs={config?.settingsConfigs}
            />
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};
