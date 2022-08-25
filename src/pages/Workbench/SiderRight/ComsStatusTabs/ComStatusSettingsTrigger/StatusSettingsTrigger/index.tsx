/** 组件的状态配置（当前 tab 激活的状态） */

import { useSelectedComDefaultStatId } from '@/hooks/selected/useSelectedComDefaultStatId';
import { useSelectedComponentActiveStatus } from '@/hooks/selected/useSelectedComponentActiveStatus';
import {
  DrawerForm,
  ProFormInstance,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

export default () => {
  const formRef = useRef<ProFormInstance>();

  const { stat } = useSelectedComponentActiveStatus();

  const { selectedComDefaultStatId } = useSelectedComDefaultStatId();

  const { setComStatusSettingsDefaults } = useModel(
    'page.statusSettingsDefaults',
    (model) => ({
      setComStatusSettingsDefaults: model.setComStatusSettingsDefaults,
    }),
  );

  const { setSelectedComActiveStatName } = useModel(
    'page.comsStatus',
    (model) => ({
      setSelectedComActiveStatName: model.setSelectedComActiveStatName,
    }),
  );

  const { getStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  return (
    <DrawerForm<{
      isDefault: boolean;
      name: string;
    }>
      title={`状态配置 - ${stat?.name}`}
      formRef={formRef}
      trigger={<div>基本配置</div>}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      initialValues={{
        name: stat?.name,
        isDefault: selectedComDefaultStatId === stat?.id,
      }}
      width={400}
      submitTimeout={2000}
      onFinish={async (values) => {
        message.success('保存成功');

        if ((selectedComDefaultStatId === stat?.id) !== values.isDefault) {
          const selected = getStageSelectNodeId();
          if (selected && stat?.id) {
            setComStatusSettingsDefaults(selected, stat?.id);
          }
        }

        if (values.name !== stat?.name) {
          setSelectedComActiveStatName(values.name);
        }

        triggerPrepareSaveTimeChange();

        // 不返回不会关闭弹框
        return true;
      }}
    >
      <ProFormText
        name="name"
        label="状态名称"
        placeholder="请输入"
        rules={[
          {
            required: true,
          },
        ]}
      />
      <ProFormSwitch
        name="isDefault"
        disabled={selectedComDefaultStatId === stat?.id}
        label="是否为默认状态"
        placeholder="请选择"
      />
    </DrawerForm>
  );
};
