import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { DiscussCountInfo } from '../DiscussCountInfo';
import { DiscussListActions } from '../DiscussListActions';

export default () => {
  const { filterDiscusses, setSelectedDiscussId, setDetailMode } = useModel(
    'playground',
    (model) => ({
      filterDiscusses: model.filterDiscusses,
      setSelectedDiscussId: model.setSelectedDiscussId,
      setDetailMode: model.setDetailMode,
    }),
  );

  const { allDiscussCommentsCount } = useModel(
    'discuss.allDiscussCommentsCount',
    (model) => ({
      allDiscussCommentsCount: model.allDiscussCommentsCount,
    }),
  );

  return (
    <>
      {location.pathname === '/workbench' ? (
        <Row justify="space-between" style={{ marginBottom: 10 }}>
          <DiscussCountInfo
            style={{
              marginLeft: 15,
            }}
          />
          <DiscussListActions size="small" />
        </Row>
      ) : null}
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
              return (
                <Avatar
                  src="https://joeschmoe.io/api/v1/random"
                  alt="Han Solo"
                />
              );
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
                      admin
                    </Typography.Text>
                    {allDiscussCommentsCount[item.id] ? (
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {allDiscussCommentsCount[item.id]} 条评论
                      </Typography.Text>
                    ) : null}
                    <Typography.Text
                      type="secondary"
                      style={{
                        color: '#ccc',
                        fontSize: 10,
                      }}
                    >
                      {dayjs(item.createdAt).fromNow()}
                    </Typography.Text>
                  </Space>
                </div>
              );
            },
          },
        }}
      />
    </>
  );
};
