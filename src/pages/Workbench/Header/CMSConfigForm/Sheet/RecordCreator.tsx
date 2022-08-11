import { useSelectedData } from '@/hooks/useSelectedData';
import { PlusOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  DrawerForm,
  ProFormColumnsType,
  ProFormInstance,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useMemo, useRef } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const formRef = useRef<ProFormInstance>();

  const { selectedData } = useSelectedData();

  const { columns } = selectedData?.data ?? {};

  const formColumns = useMemo((): ProFormColumnsType[] => {
    return (
      columns?.map((col) => {
        return {
          title: col.title,
          key: col.key,
          dataIndex: col.dataIndex,
          valueType: col.valueType,
          valueEnum: col.valueEnum,
          formItemProps: col.formItemProps,
        };
      }) ?? []
    );
  }, [columns]);

  return (
    <DrawerForm<{
      name: string;
      company: string;
    }>
      title="新增一条"
      formRef={formRef}
      trigger={
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新增一条
        </Button>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
      <BetaSchemaForm layoutType="Embed" columns={formColumns} />
    </DrawerForm>
  );
};
