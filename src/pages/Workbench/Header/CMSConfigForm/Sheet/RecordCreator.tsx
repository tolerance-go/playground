import { useSelectedData } from '@/hooks/selected/useSelectedData';
import { PlusOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  DrawerForm,
  ProFormColumnsType,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import { useMemo, useRef } from 'react';

export default () => {
  const formRef = useRef<ProFormInstance>();

  const { selectedData } = useSelectedData();

  const { columns } = selectedData?.data ?? {};

  const { selectedDataId } = useModel('database.selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const { getColumnDataMetaAfterPushDataSource, pushDataListItemDataSource } =
    useModel('database.dataList', (model) => ({
      getColumnDataMetaAfterPushDataSource:
        model.getColumnDataMetaAfterPushDataSource,
      pushDataListItemDataSource: model.pushDataListItemDataSource,
    }));

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

        pushDataListItemDataSource(selectedDataId, record);

        // 不返回不会关闭弹框
        return true;
      }}
    >
      <BetaSchemaForm layoutType="Embed" columns={formColumns} />
    </DrawerForm>
  );
};
