import { RequestButton } from '@/components/RequestButton';
import { useSelectedData } from '@/hooks/useSelectedData';
import { DataItem, DataTableColumn } from '@/models/dataList';
import { DatabaseControllerUpdate } from '@/services/server/DatabaseController';
import type { ActionType, ProTableProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import {
  Button,
  Dropdown,
  Empty,
  Menu,
  message,
  Space,
  Typography,
} from 'antd';
import { nanoid } from 'nanoid';
import { useMemo, useRef } from 'react';
import { ColumnsConfigModal } from './ColumnsConfigModal';
import RecordCreator from './RecordCreator';
import RecordUpdator from './RecordUpdator';

export default () => {
  const { selectedData } = useSelectedData();

  const { columns, dataSource, columnsSettings } = selectedData?.data ?? {};

  const actionRef = useRef<ActionType>();

  // const modalRef = useRef<ColumnsConfigModalAPI>(null);

  const { addColumn, getColumnDataMetaAfterAddColumn } = useModel(
    'dataList',
    (model) => ({
      addColumn: model.addColumn,
      getColumnDataMetaAfterAddColumn: model.getColumnDataMetaAfterAddColumn,
    }),
  );

  const { openModal, setSelectedColumnFieldId } = useModel(
    'dataFieldsConfig',
    (model) => ({
      openModal: model.openModal,
      setSelectedColumnFieldId: model.setSelectedColumnFieldId,
    }),
  );

  const { selectedDataId } = useModel('selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const { getColumnDataMetaAfterRemoveDataSource, removeDataSource } = useModel(
    'dataList',
    (model) => ({
      getColumnDataMetaAfterRemoveDataSource:
        model.getColumnDataMetaAfterRemoveDataSource,
      removeDataSource: model.removeDataSource,
    }),
  );

  const addColumnAndSync = useMemoizedFn(async (newCol: DataTableColumn) => {
    if (!selectedDataId) return;

    const id = newCol.key;

    const { success } = await DatabaseControllerUpdate(
      {
        id: String(selectedDataId),
      },
      JSON.stringify(
        getColumnDataMetaAfterAddColumn(selectedDataId, newCol).data ?? {},
      ),
    );

    if (success) {
      addColumn(selectedDataId, newCol);
      openModal();
      setSelectedColumnFieldId(id);
    }
  });

  const mergedColumns = useMemo((): ProTableProps<
    DataItem,
    unknown,
    'text'
  >['columns'] => {
    return columns
      ?.map(
        (
          col,
        ): Required<
          ProTableProps<DataItem, unknown, 'text'>
        >['columns'][number] => {
          return {
            ...col,
            title: (__, type) =>
              type === 'table' ? (
                <Space>
                  <span>{columnsSettings?.[col.key].title ?? col.title}</span>
                  <Typography.Text
                    type="secondary"
                    copyable={{
                      text: `${col.valueType}-${col.key}`,
                    }}
                    style={{
                      fontSize: 10,
                    }}
                  >
                    ID: {col.key.slice(0, 4)}
                  </Typography.Text>
                </Space>
              ) : (
                columnsSettings?.[col.key].title ?? col.title
              ),
          };
        },
      )
      .concat({
        title: '操作',
        width: 180,
        key: 'option',
        valueType: 'option',
        render: (dom, entity) => [
          <RecordUpdator record={entity} key="edit" />,
          <RequestButton
            style={{
              padding: '0 2px',
            }}
            danger
            key="link2"
            type="link"
            size="small"
            popconfirm={{
              title: '确认删除吗？',
            }}
            request={async () => {
              if (!selectedDataId) return { success: false };

              const { success } = await DatabaseControllerUpdate(
                {
                  id: String(selectedDataId),
                },
                JSON.stringify(
                  getColumnDataMetaAfterRemoveDataSource(
                    selectedDataId,
                    entity.id,
                  ).data ?? {},
                ),
              );

              return {
                success,
              };
            }}
            onSuccess={() => {
              if (selectedDataId) {
                message.success('删除成功');
                removeDataSource(selectedDataId, entity.id);
              }
            }}
          >
            删除
          </RequestButton>,
        ],
      });
  }, [columnsSettings, columns]);

  if (!selectedDataId) {
    return <Empty />;
  }

  return (
    <>
      <ProTable<DataItem>
        columns={mergedColumns}
        dataSource={dataSource}
        actionRef={actionRef}
        cardBordered
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle={
          selectedData ? (
            <Space>
              {selectedData.name}
              <Typography.Text
                copyable={{
                  text: String(selectedData.id),
                }}
                type="secondary"
              >
                ID: {selectedData.id}
              </Typography.Text>
            </Space>
          ) : null
        }
        toolBarRender={() => [
          <RecordCreator key="button"></RecordCreator>,
          <Dropdown
            key="menu"
            overlay={
              <Menu
                items={[
                  {
                    label: '新增列',
                    key: 'add',
                    type: 'group',
                  },
                  {
                    label: '文本',
                    key: 'text',
                    onClick: async () => {
                      const id = nanoid();
                      addColumnAndSync({
                        title: '文本',
                        dataIndex: `text-${id}`,
                        key: id,
                        valueType: 'text',
                      });
                    },
                  },
                  {
                    label: '日期',
                    key: 'date',
                    onClick: () => {
                      const id = nanoid();
                      addColumnAndSync({
                        title: '日期',
                        dataIndex: `date-${id}`,
                        key: id,
                        valueType: 'date',
                      });
                    },
                  },
                  {
                    type: 'divider',
                  },
                  {
                    label: '编辑列',
                    key: 'editColumns',
                    onClick: () => {
                      openModal();
                    },
                  },
                ]}
              />
            }
          >
            <Button>列管理</Button>
          </Dropdown>,
        ]}
      />
      <ColumnsConfigModal />
    </>
  );
};
