import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
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
        createComponentStatusFromNow(values.name);
        message.success('创建成功');
        return true;
      }}
    >
      <ProFormText name="name" label="名称" placeholder="请输入名称" />
    </DrawerForm>
  );
});
