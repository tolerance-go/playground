import { ConfigsForm } from '@/components/ConfigsForm';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import { EditOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { useMemo, useRef } from 'react';

/** 组件的动作编辑和创建表单 */
export default ({
  mode,
  actionId,
}: {
  mode: 'edit' | 'create';
  actionId?: string;
}) => {
  const { comsActionsConfigs } = useModel('comsActionsConfigs', (model) => ({
    comsActionsConfigs: model.comsActionsConfigs,
  }));

  const { stageSelectNode } = useSelectedNode();

  const selectedComsActionsConfigs = stageSelectNode?.type
    ? comsActionsConfigs[stageSelectNode.type]
    : undefined;

  // const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();

  const { createComStatAction, updateComStatAction, comsActions } = useModel(
    'comsActions',
    (model) => ({
      createComStatAction: model.createComStatAction,
      updateComStatAction: model.updateComStatAction,
      comsActions: model.comsActions,
    }),
  );

  const { getStageSelectNodeId, stageSelectNodeId } = useModel(
    'stageSelectNodeId',
    (model) => ({
      getStageSelectNodeId: model.getStageSelectNodeId,
      stageSelectNodeId: model.stageSelectNodeId,
    }),
  );

  const { getSelectedComponentStatusId, selectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const actionData = useMemo(() => {
    if (
      mode === 'edit' &&
      stageSelectNodeId &&
      selectedComponentStatusId &&
      actionId
    ) {
      return comsActions[stageSelectNodeId][selectedComponentStatusId][
        actionId
      ];
    }
    return undefined;
  }, [
    mode,
    comsActions,
    actionId,
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
        destroyOnClose: mode === 'edit' ? true : false,
      }}
      title={mode === 'create' ? '新建动作' : '编辑动作'}
      trigger={
        mode === 'create' ? (
          <Button block>添加动作</Button>
        ) : (
          <a>
            <EditOutlined />
          </a>
        )
      }
      width={800}
      submitTimeout={2000}
      autoFocusFirstInput
      onFinish={async ({ type, name, settings }) => {
        const selectedComId = getStageSelectNodeId();
        const selectedComStatId = getSelectedComponentStatusId();
        if (selectedComId && selectedComStatId) {
          const actionData = {
            type: type.value,
            name,
            settings,
            typeZh: type.label,
          };

          if (mode === 'create') {
            createComStatAction(selectedComId, selectedComStatId, actionData);
          } else {
            if (actionId) {
              updateComStatAction(selectedComId, selectedComStatId, {
                id: actionId,
                ...actionData,
              });
            }
          }

          triggerPrepareSaveTimeChange();
        }
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
        label="动作名称"
        placeholder="请输入"
      />
      <ProFormSelect
        rules={[
          {
            required: true,
          },
        ]}
        name="type"
        label="动作类型"
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
