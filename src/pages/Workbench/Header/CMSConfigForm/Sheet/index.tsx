import { RequestButton } from '@/components/RequestButton';
import { useSelectedData } from '@/hooks/selected/useSelectedData';
import { DataItem, DataTableColumn } from '@/models/dataList';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { ActionType, ProTableProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Button, Dropdown, Empty, Menu, Row, Space, Typography } from 'antd';
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

  const {
    addDataListItemColumn,
    moveLeftDataListItemColumn,
    moveRightDataListItemColumn,
    deleteDataListItemColumn,
  } = useModel('database.dataList', (model) => ({
    addDataListItemColumn: model.addDataListItemColumn,
    deleteDataListItemColumn: model.deleteDataListItemColumn,
    moveLeftDataListItemColumn: model.moveLeftDataListItemColumn,
    moveRightDataListItemColumn: model.moveRightDataListItemColumn,
    getColumnDataMetaAfterAddColumn: model.getColumnDataMetaAfterAddColumn,
  }));

  const { openModal, setSelectedColumnFieldId } = useModel(
    'database.dataFieldsConfig',
    (model) => ({
      openModal: model.openModal,
      setSelectedColumnFieldId: model.setSelectedColumnFieldId,
    }),
  );

  const { selectedDataId } = useModel('database.selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const { removeDataListItemDataSource } = useModel('database.dataList', (model) => ({
    removeDataListItemDataSource: model.removeDataListItemDataSource,
  }));

  const addColumn = useMemoizedFn(async (newCol: DataTableColumn) => {
    if (!selectedDataId) return;

    const id = newCol.key;

    addDataListItemColumn(selectedDataId, newCol);
    openModal();
    setSelectedColumnFieldId(id);
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
                <Dropdown
                  overlay={
                    <Menu
                      items={[
                        {
                          key: 'copyId',
                          label: (
                            <Typography.Text
                              type="secondary"
                              copyable={{
                                text: `${col.valueType}-${col.key}`,
                              }}
                              style={{
                                width: 100,
                              }}
                              ellipsis
                            >
                              ID: {col.key}
                            </Typography.Text>
                          ),
                        },
                        {
                          key: 'moveLeft',
                          label: (
                            <Row align="middle" justify="space-between">
                              <span>右移</span>
                              <ArrowRightOutlined
                                style={{
                                  fontSize: 12,
                                }}
                              />
                            </Row>
                          ),
                          onClick: () => {
                            moveRightDataListItemColumn(selectedDataId!, col);
                          },
                        },
                        {
                          key: 'moveRight',
                          label: (
                            <Row align="middle" justify="space-between">
                              <span>左移</span>
                              <ArrowLeftOutlined
                                style={{
                                  fontSize: 12,
                                }}
                              />
                            </Row>
                          ),
                          onClick: () => {
                            moveLeftDataListItemColumn(selectedDataId!, col);
                          },
                        },
                        {
                          key: 'delete',
                          label: '删除',
                          danger: true,
                          onClick: () => {
                            deleteDataListItemColumn(selectedDataId!, col);
                          },
                        },
                      ]}
                    />
                  }
                >
                  <span>{columnsSettings?.[col.key].title ?? col.title}</span>
                </Dropdown>
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
            onClick={() => {
              if (selectedDataId) {
                removeDataListItemDataSource(selectedDataId, entity.id);
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
                      addColumn({
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
                      addColumn({
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
