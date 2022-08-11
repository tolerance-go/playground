import { useSelectedData } from '@/hooks/useSelectedData';
import { DataItem } from '@/models/dataList';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Dropdown, Empty, Menu } from 'antd';
import { useRef } from 'react';
import {
  ColumnsConfigModal,
  ColumnsConfigModalAPI,
} from './ColumnsConfigModal';
import RecordCreator from './RecordCreator';

export default () => {
  const { selectedData } = useSelectedData();

  const { columns, dataSource } = selectedData?.data ?? {};

  const actionRef = useRef<ActionType>();

  const modalRef = useRef<ColumnsConfigModalAPI>(null);

  const { addColumn } = useModel('dataList', (model) => ({
    addColumn: model.addColumn,
  }));

  const { selectedDataId } = useModel('selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  if (!selectedDataId) {
    return <Empty />;
  }

  return (
    <>
      <ProTable<DataItem>
        columns={columns}
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
        headerTitle={selectedData?.name}
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
                    onClick: () => {
                      addColumn(selectedDataId, {
                        title: '文本',
                        dataIndex: 'text',
                        key: 'text',
                      });
                    },
                  },
                  {
                    label: '日期',
                    key: 'date',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    label: '编辑列',
                    key: 'editColumns',
                    onClick: () => {
                      modalRef.current?.open();
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
      <ColumnsConfigModal ref={modalRef} />
    </>
  );
};
