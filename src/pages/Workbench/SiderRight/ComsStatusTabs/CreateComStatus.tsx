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

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type CreateComStatusAPI = {
  open: () => void;
};

export default React.forwardRef<CreateComStatusAPI>((props, ref) => {
  const formRef = useRef<ProFormInstance>();

  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
  }));

  const { createComponentStatusFromNow } = useModel(
    'statusSettings',
    (model) => ({
      createComponentStatusFromNow: model.createComponentStatusFromNow,
    }),
  );

  const { triggerSave } = useModel('stageAutoSave', (model) => ({
    triggerSave: model.triggerSave,
  }));

  const { setSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
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
        createComponentStatusFromNow(newStatId, values.name);
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
