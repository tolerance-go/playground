import { ConfigsForm } from '@/components/ConfigsForm';
import { useComStatusExtendActions } from '@/hooks/relations/useComStatusExtendActions';
import { useSelectedNode } from '@/hooks/selected/useSelectedNode';
import { ComponentAction } from '@/models/comsActions';
import { ComStatRelation } from '@/models/statusRelations';
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
  actionItem,
  extendRelation,
}: {
  mode: 'edit' | 'create';
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

  const { createComStatAction, comsActions } = useModel(
    'page.comsActions',
    (model) => ({
      createComStatAction: model.createComStatAction,
      comsActions: model.comsActions,
    }),
  );

  const { getStageSelectNodeId, stageSelectNodeId } = useModel(
    'stage.stageSelectNodeId',
    (model) => ({
      getStageSelectNodeId: model.getStageSelectNodeId,
      stageSelectNodeId: model.stageSelectNodeId,
    }),
  );

  const { getSelectedComponentStatusId, selectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const { setCurrentComActionsExtendsActions } = useComStatusExtendActions();

  const disabled =
    actionItem && extendRelation
      ? !extendRelation?.actionUnsyncFields[actionItem.name]
      : false;

  const renderTrigger = () => {
    return mode === 'create' ? (
      <Button disabled={disabled} block>
        添加动作
      </Button>
    ) : (
      <a
        style={{
          color: disabled ? '#aaa' : undefined,
        }}
      >
        <EditOutlined />
      </a>
    );
  };

  const actionData = useMemo(() => {
    if (
      mode === 'edit' &&
      stageSelectNodeId &&
      selectedComponentStatusId &&
      actionItem?.id
    ) {
      return comsActions[stageSelectNodeId][selectedComponentStatusId][
        actionItem?.id
      ];
    }
    return undefined;
  }, [
    mode,
    comsActions,
    actionItem?.id,
    stageSelectNodeId,
    selectedComponentStatusId,
  ]);

  if (disabled) {
    return renderTrigger();
  }

  return (
    <ModalForm
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
      trigger={renderTrigger()}
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
            if (actionItem?.id) {
              setCurrentComActionsExtendsActions({
                /** 这里用 actionItem.name 作为 key，值为旧值 */
                [actionItem.name]: {
                  id: actionItem?.id,
                  ...actionData,
                },
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
        disabled={!!extendRelation}
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
