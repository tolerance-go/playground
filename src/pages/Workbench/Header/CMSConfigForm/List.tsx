import { RequestButton } from '@/components/RequestButton';
import { DataListItem } from '@/models/dataList';
import { DatabaseControllerDestroy } from '@/services/server/DatabaseController';
import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import Creator from './Creator';

export default () => {
  const { dataList, deleteData } = useModel('dataList', (model) => ({
    dataList: model.dataList,
    deleteData: model.deleteData,
  }));

  const { setSelectedDataId, selectedDataId } = useModel(
    'selectedDataId',
    (model) => ({
      setSelectedDataId: model.setSelectedDataId,
      selectedDataId: model.selectedDataId,
    }),
  );

  return (
    <ProList<DataListItem>
      toolBarRender={() => {
        return [<Creator key="create" />];
      }}
      pagination={{
        defaultPageSize: 10,
        size: 'small',
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            setSelectedDataId(record.id);
          },
          className:
            selectedDataId === record.id ? 'selectedProListItem' : undefined,
        };
      }}
      rowKey="name"
      headerTitle="集合列表"
      dataSource={dataList}
      metas={{
        title: {
          dataIndex: 'name',
        },
        description: {
          dataIndex: 'desc',
        },
        actions: {
          render: (dom, entity) => [
            <RequestButton
              key={'remove'}
              size="small"
              type="link"
              danger
              request={async () => {
                return await DatabaseControllerDestroy({
                  id: String(entity.id),
                });
              }}
              onSuccess={() => {
                message.success('删除成功');
                deleteData(entity.id);
              }}
              popconfirm={{
                title: '确认删除吗？',
              }}
            >
              删除
            </RequestButton>,
          ],
        },
      }}
    />
  );
};
