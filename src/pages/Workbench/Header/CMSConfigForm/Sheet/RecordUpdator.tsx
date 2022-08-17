import { useSelectedData } from '@/hooks/useSelectedData';
import { DataItem } from '@/models/dataList';
import { DatabaseControllerUpdate } from '@/services/server/DatabaseController';
import {
  BetaSchemaForm,
  DrawerForm,
  ProFormColumnsType,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useMemo, useRef } from 'react';

export default (props: { record: DataItem }) => {
  const formRef = useRef<ProFormInstance>();

  const { selectedData } = useSelectedData();

  const { columns } = selectedData?.data ?? {};

  const { selectedDataId } = useModel('selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const { getColumnDataMetaAfterUpdateDataSource, updateDataSource } = useModel(
    'dataList',
    (model) => ({
      getColumnDataMetaAfterUpdateDataSource:
        model.getColumnDataMetaAfterUpdateDataSource,
      updateDataSource: model.updateDataSource,
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

        const { success } = await DatabaseControllerUpdate(
          {
            id: String(selectedDataId),
          },
          JSON.stringify(
            getColumnDataMetaAfterUpdateDataSource(
              selectedDataId,
              props.record.id,
              patchRecord,
            ).data ?? {},
          ),
        );

        if (success) {
          message.success('更新成功');
          updateDataSource(selectedDataId, props.record.id, patchRecord);
        }

        // 不返回不会关闭弹框
        return true;
      }}
    >
      <BetaSchemaForm layoutType="Embed" columns={formColumns} />
    </DrawerForm>
  );
};
