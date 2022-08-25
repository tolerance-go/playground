import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { nanoid } from 'nanoid';
import React, { useImperativeHandle, useRef, useState } from 'react';

export type CreateComStatusAPI = {
  open: () => void;
};

export default React.forwardRef<CreateComStatusAPI>((props, ref) => {
  const formRef = useRef<ProFormInstance>();

  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
  }));

  const { createSelectedComponentStat } = useModel('page.comsStatus', (model) => ({
    createSelectedComponentStat: model.createSelectedComponentStat,
  }));

  const { copySelectedComSettingFromActiveStatToOtherStat } = useModel(
    'page.comsSettings',
    (model) => ({
      copySelectedComSettingFromActiveStatToOtherStat:
        model.copySelectedComSettingFromActiveStatToOtherStat,
    }),
  );

  const { copySelectedComActionFromActiveStatToOtherStat } = useModel(
    'page.comsActions',
    (model) => ({
      copySelectedComActionFromActiveStatToOtherStat:
        model.copySelectedComActionFromActiveStatToOtherStat,
    }),
  );

  const { copySelectedComEventFromActiveStatToOtherStat } = useModel(
    'page.comsEvents',
    (model) => ({
      copySelectedComEventFromActiveStatToOtherStat:
        model.copySelectedComEventFromActiveStatToOtherStat,
    }),
  );

  const { copySelectedComStyleFromActiveStatToOtherStat } = useModel(
    'page.comsStyles',
    (model) => ({
      copySelectedComStyleFromActiveStatToOtherStat:
        model.copySelectedComStyleFromActiveStatToOtherStat,
    }),
  );

  const { triggerSave } = useModel('app.stageAutoSave', (model) => ({
    triggerSave: model.triggerPrepareSaveTimeChange,
  }));

  const { setSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      setSelectedComponentStatusId: model.setSelectedComponentStatusId,
    }),
  );

  return (
    <DrawerForm<{
      name: string;
    }>
      title="新建配置状态"
      formRef={formRef}
      trigger={<PlusOutlined />}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      width={400}
      visible={visible}
      onVisibleChange={setVisible}
      submitTimeout={2000}
      onFinish={async (values) => {
        const newStatId = nanoid();

        createSelectedComponentStat(newStatId, values.name);

        copySelectedComSettingFromActiveStatToOtherStat(newStatId);

        copySelectedComActionFromActiveStatToOtherStat(newStatId);

        copySelectedComEventFromActiveStatToOtherStat(newStatId);

        copySelectedComStyleFromActiveStatToOtherStat(newStatId);

        setSelectedComponentStatusId(newStatId);

        message.success('创建成功');
        triggerSave();
        return true;
      }}
    >
      <ProFormText name="name" label="名称" placeholder="请输入名称" />
    </DrawerForm>
  );
});
