import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

export default () => {
  const { filterDiscusses, setSelectedDiscussId, setDetailMode } = useModel(
    'playground',
    (model) => ({
      filterDiscusses: model.filterDiscusses,
      setSelectedDiscussId: model.setSelectedDiscussId,
      setDetailMode: model.setDetailMode,
    }),
  );

  return (
    <ProList<API.ShownDiscuss>
      rowKey="id"
      dataSource={filterDiscusses}
      showActions="hover"
      onRow={(record) => {
        return {
          onClick: () => {
            setSelectedDiscussId(record.id);
            setDetailMode('detail');
          },
        };
      }}
      metas={{
        title: {
          dataIndex: 'title',
        },
        avatar: {
          render: () => {
            return <Avatar />;
          },
        },
        description: {
          render: (dom, item) => {
            return (
              <div>
                <Space>
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: 10,
                    }}
                  >
                    {dayjs(item.createdAt).fromNow()}
                  </Typography.Text>
                  <Tag>30 条评论</Tag>
                </Space>
              </div>
            );
          },
        },
      }}
    />
  );
};
