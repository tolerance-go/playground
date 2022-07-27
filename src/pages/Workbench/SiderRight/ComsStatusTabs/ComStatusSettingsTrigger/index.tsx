import { BranchesOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormInstance } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message, Tabs } from 'antd';
import { nanoid } from 'nanoid';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { ComStatusTreeMap } from './ComStatusTreeMap';

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
      title="组件状态配置"
      formRef={formRef}
      trigger={
        <Button
          size="small"
          type="text"
          shape="circle"
          style={{
            marginLeft: 5,
          }}
        >
          <BranchesOutlined />
        </Button>
      }
      autoFocusFirstInput
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
      <Tabs>
        <Tabs.TabPane key={'1'} tab="状态继承结构">
          <ComStatusTreeMap />
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab="基本配置">
          <ComStatusTreeMap />
        </Tabs.TabPane>
      </Tabs>
    </DrawerForm>
  );
});
