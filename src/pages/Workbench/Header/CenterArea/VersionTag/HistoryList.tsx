import { VersionControllerDestroy } from '@/services/server/VersionController';
import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Badge, Button, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styles from './HistoryList.less';

export const RemoveBtn = ({ item }: { item: API.Version }) => {
  const { deleteVersion } = useModel('app.versionList', (model) => ({
    deleteVersion: model?.deleteVersion,
  }));

  const { run, loading } = useRequest(
    async () => {
      return VersionControllerDestroy({
        id: String(item.id),
      });
    },
    {
      manual: true,
      onSuccess: () => {
        deleteVersion({
          ...item,
        });
      },
    },
  );

  return (
    <Popconfirm title="确认删除吗?" onConfirm={run}>
      <Button loading={loading} size="small" key="link" type="link" danger>
        删除
      </Button>
    </Popconfirm>
  );
};

export default () => {
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1');

  const { data, loading, runLoadList, activeVersionId, setActiveVersionId } =
    useModel('app.versionList', (model) => ({
      data: model?.data,
      loading: model?.loading,
      runLoadList: model?.runLoadList,
      activeVersionId: model?.activeVersionId,
      setActiveVersionId: model?.setActiveVersionId,
    }));

  useEffect(() => {
    runLoadList();
  }, []);

  return (
    <div
      className={styles.wrap}
      style={{
        width: 400,
      }}
    >
      <ProList
        pagination={{
          defaultPageSize: 5,
          size: 'small',
        }}
        loading={loading}
        // showActions="hover"
        dataSource={data?.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          desc: `${'User'} - ${dayjs(item.created_at).format(
            'YYYY/MM/DD HH:mm:ss',
          )}`,
        }))}
        onRow={(record: API.Version) => {
          return {
            onClick: () => {
              setActiveVersionId(record.id);
            },
          };
        }}
        metas={{
          title: {
            dataIndex: 'name',
            render: (dom, item) => [
              item.id === activeVersionId ? (
                <Space key="1">
                  {dom}
                  <Tag color={'blue'}>应用中</Tag>
                </Space>
              ) : (
                dom
              ),
            ],
          },
          description: {
            dataIndex: 'desc',
          },
          actions: {
            render: (text, item) => [<RemoveBtn item={item} key="remove" />],
          },
        }}
        toolbar={{
          menu: {
            activeKey,
            items: [
              {
                key: 'tab1',
                label: (
                  <span>
                    全部版本
                    <Badge
                      count={data?.length ?? 0}
                      style={{
                        marginTop: -2,
                        marginLeft: 4,
                        color: '#999',
                        backgroundColor: '#eee',
                      }}
                    />
                  </span>
                ),
              },
            ],
            onChange(key) {
              setActiveKey(key);
            },
          },
          // actions: [<SaveToVersionBtn key={'save'} />],
        }}
      />
    </div>
  );
};
