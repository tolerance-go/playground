import { ConfigsForm } from '@/components/ConfigsForm';
import { useSelectedNode } from '@/hooks/selected/useSelectedNode';
import { ComponentAction } from '@/models/page/comsActions';
import { ComStatRelation } from '@/models/page/statusConnectRelations';
import { EyeOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useMemo, useRef } from 'react';

/** 组件的动作编辑和创建表单 */
export default ({
  actionItem,
  extendRelation,
}: {
  actionItem?: ComponentAction;
  extendRelation?: ComStatRelation;
}) => {
  const { comsActionsConfigs } = useModel('config.comsActionsConfigs', (model) => ({
    comsActionsConfigs: model.comsActionsConfigs,
  }));

  const { stageSelectNode } = useSelectedNode();

  const selectedComsActionsConfigs = stageSelectNode?.type
    ? comsActionsConfigs[stageSelectNode.type]
    : undefined;

  // const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();

  const { comsActions } = useModel('page.comsActions', (model) => ({
    comsActions: model.comsActions,
  }));

  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const { selectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  const actionData = useMemo(() => {
    if (stageSelectNodeId && selectedComponentStatusId && actionItem?.id) {
      return comsActions[stageSelectNodeId][selectedComponentStatusId][
        actionItem?.id
      ];
    }
    return undefined;
  }, [
    comsActions,
    actionItem?.id,
    stageSelectNodeId,
    selectedComponentStatusId,
  ]);

  return (
    <ModalForm
      // form={form}
      formRef={formRef}
      initialValues={{
        type: {
          value: actionData?.type,
          label: actionData?.typeZh,
        },
        name: actionData?.name,
        settings: actionData?.settings,
      }}
      modalProps={{
        destroyOnClose: true,
      }}
      title={'查看动作'}
      trigger={
        <a>
          <EyeOutlined />
        </a>
      }
      width={800}
      submitTimeout={2000}
      autoFocusFirstInput
    >
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="name"
        label="动作名称"
        placeholder="请输入"
        disabled={!!extendRelation}
        readonly
      />
      <ProFormSelect
        rules={[
          {
            required: true,
          },
        ]}
        name="type"
        label="动作类型"
        readonly
        placeholder="请选择"
        options={selectedComsActionsConfigs?.map((item) => ({
          label: item.name,
          value: item.type,
        }))}
        fieldProps={{
          labelInValue: true,
        }}
      />
      <ProFormDependency name={['type']}>
        {({ type }) => {
          const config = selectedComsActionsConfigs?.find(
            (item) => item.type === type?.value,
          );
          return (
            <ConfigsForm
              onlyFormItem
              formItemNamePrefix="settings"
              configs={config?.settingsConfigs}
            />
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};
