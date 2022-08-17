import { useSelectedData } from '@/hooks/useSelectedData';
import { DatabaseControllerUpdate } from '@/services/server/DatabaseController';
import { PlusOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  DrawerForm,
  ProFormColumnsType,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { nanoid } from 'nanoid';
import { useMemo, useRef } from 'react';

export default () => {
  const formRef = useRef<ProFormInstance>();

  const { selectedData } = useSelectedData();

  const { columns } = selectedData?.data ?? {};

  const { selectedDataId } = useModel('selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const { getColumnDataMetaAfterPushDataSource, pushDataSource } = useModel(
    'dataList',
    (model) => ({
      getColumnDataMetaAfterPushDataSource:
        model.getColumnDataMetaAfterPushDataSource,

      pushDataSource: model.pushDataSource,
    }),
  );

  const formColumns = useMemo((): ProFormColumnsType[] => {
    return (
      columns?.map((col) => {
        return {
          title: col.title,
          key: `${col.valueType}-${col.key}`,
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
        if (!selectedDataId) return;
        const id = nanoid();

        const record = {
          id,
          ...values,
        };

        const { success } = await DatabaseControllerUpdate(
          {
            id: String(selectedDataId),
          },
          JSON.stringify(
            getColumnDataMetaAfterPushDataSource(selectedDataId, record).data ??
              {},
          ),
        );

        if (success) {
          message.success('新增成功');
          pushDataSource(selectedDataId, record);
        }

        // 不返回不会关闭弹框
        return true;
      }}
    >
      <BetaSchemaForm layoutType="Embed" columns={formColumns} />
    </DrawerForm>
  );
};
