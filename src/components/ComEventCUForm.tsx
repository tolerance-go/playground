import { ConfigsForm } from '@/components/ConfigsForm';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import { ComponentEvent } from '@/models/comsEvents';
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
  eventId,
}: {
  mode: 'edit' | 'create';
  eventId?: string;
}) => {
  const { comsEventsConfigs } = useModel('comsEventsConfigs', (model) => ({
    comsEventsConfigs: model.comsEventsConfigs,
  }));

  const { stageSelectNode } = useSelectedNode();

  const selectedComsEventsConfigs = stageSelectNode?.type
    ? comsEventsConfigs[stageSelectNode.type]
    : undefined;

  // const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();

  const { getComStatActions } = useModel('comsActions', (model) => ({
    getComStatActions: model.getComStatActions,
  }));

  const { createComStatEvent, updateComStatEvent, comsEvents } = useModel(
    'comsEvents',
    (model) => ({
      createComStatEvent: model.createComStatEvent,
      updateComStatEvent: model.updateComStatEvent,
      comsEvents: model.comsEvents,
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

  const { getComStatus } = useModel('statusSettings', (model) => ({
    getComStatus: model.getComStatus,
  }));

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const eventData = useMemo(() => {
    if (
      mode === 'edit' &&
      stageSelectNodeId &&
      selectedComponentStatusId &&
      eventId
    ) {
      return comsEvents[stageSelectNodeId][selectedComponentStatusId][eventId];
    }
    return undefined;
  }, [mode, comsEvents, eventId, stageSelectNodeId, selectedComponentStatusId]);

  return (
    <ModalForm
      // form={form}
      formRef={formRef}
      initialValues={{
        type: {
          value: eventData?.type,
          label: eventData?.typeZh,
        },
        name: eventData?.name,
        execComId: eventData?.execComId,
        execComStatId: eventData?.execComStatId,
        execComStatActionId: eventData?.execComStatActionId,
        settings: eventData?.settings,
      }}
      modalProps={{
        destroyOnClose: mode === 'edit' ? true : false,
      }}
      title={mode === 'create' ? '新建事件' : '编辑事件'}
      trigger={
        mode === 'create' ? (
          <Button block>添加事件</Button>
        ) : (
          <a key="edit">编辑</a>
        )
      }
      width={800}
      submitTimeout={2000}
      autoFocusFirstInput
      onFinish={async ({
        type,
        name,
        settings,
        execComId,
        execComStatId,
        execComStatActionId,
      }) => {
        const selectedComId = getStageSelectNodeId();
        const selectedComStatId = getSelectedComponentStatusId();
        if (selectedComId && selectedComStatId) {
          const eventData: Omit<ComponentEvent, 'id'> = {
            type: type.value,
            name,
            settings,
            typeZh: type.label,
            execComId,
            execComStatId,
            execComStatActionId,
          };

          if (mode === 'create') {
            createComStatEvent(selectedComId, selectedComStatId, eventData);
          } else {
            if (eventId) {
              updateComStatEvent(selectedComId, selectedComStatId, {
                id: eventId,
                ...eventData,
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
        label="事件名称"
        placeholder="请输入"
      />
      <ProFormSelect
        rules={[
          {
            required: true,
          },
        ]}
        name="type"
        label="事件类型"
        placeholder="请选择"
        options={selectedComsEventsConfigs?.map((item) => ({
          label: item.name,
          value: item.type,
        }))}
        fieldProps={{
          labelInValue: true,
        }}
      />
      <ProFormDependency name={['type']}>
        {({ type }) => {
          const config = selectedComsEventsConfigs?.find(
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
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="execComId"
        label="执行组件"
        placeholder="请输入"
      />

      <ProFormDependency name={['execComId']}>
        {({ execComId }) => {
          const comStatus = getComStatus(execComId);
          return (
            <ProFormSelect
              disabled={!execComId}
              rules={[
                {
                  required: true,
                },
              ]}
              name="execComStatId"
              label="执行状态"
              placeholder="请输入"
              options={Object.keys(comStatus ?? {})?.map((statId) => {
                const stat = comStatus[statId];
                return {
                  label: stat.name,
                  value: stat.id,
                };
              })}
            />
          );
        }}
      </ProFormDependency>

      <ProFormDependency name={['execComId', 'execComStatId']}>
        {({ execComId, execComStatId }) => {
          const actions = getComStatActions(execComId, execComStatId);
          return (
            <ProFormSelect
              disabled={!execComId || !execComStatId}
              rules={[
                {
                  required: true,
                },
              ]}
              name="execComStatActionId"
              label="执行动作"
              placeholder="请输入"
              options={Object.keys(actions ?? {})?.map((eventId) => {
                const action = actions[eventId];
                return {
                  label: action.name,
                  value: action.id,
                };
              })}
            />
          );
        }}
      </ProFormDependency>

      <ProFormText disabled name="1111" label="触发条件(待实现)" placeholder="请输入" />
      <ProFormText disabled name="2222" label="执行条件(待实现)" placeholder="请输入" />
    </ModalForm>
  );
};
