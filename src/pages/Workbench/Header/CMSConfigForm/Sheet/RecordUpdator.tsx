import { useSelectedData } from '@/hooks/selected/useSelectedData';
import { DataItem } from '@/models/dataList';
import {
  BetaSchemaForm,
  DrawerForm,
  ProFormColumnsType,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { useMemo, useRef } from 'react';

export default (props: { record: DataItem }) => {
  const formRef = useRef<ProFormInstance>();

  const { selectedData } = useSelectedData();

  const { columns } = selectedData?.data ?? {};

  const { selectedDataId } = useModel('database.selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const {
    getColumnDataMetaAfterUpdateDataSource,
    updateDataListItemDataSource,
  } = useModel('database.dataList', (model) => ({
    getColumnDataMetaAfterUpdateDataSource:
      model.getColumnDataMetaAfterUpdateDataSource,
    updateDataListItemDataSource: model.updateDataListItemDataSource,
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
      initialValues={props.record}
      trigger={
        <Button
          key="link"
          type="link"
          size="small"
          style={{
            padding: '0 2px',
          }}
        >
          编辑
        </Button>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        if (!selectedDataId) return;

        const patchRecord = {
          ...values,
        };

        updateDataListItemDataSource(
          selectedDataId,
          props.record.id,
          patchRecord,
        );

        // 不返回不会关闭弹框
        return true;
      }}
    >
      <BetaSchemaForm layoutType="Embed" columns={formColumns} />
    </DrawerForm>
  );
};
