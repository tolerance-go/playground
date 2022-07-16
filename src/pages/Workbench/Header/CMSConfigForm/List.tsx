import { ProList } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';

const dataSource = [
  {
    name: '集合1',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: 'xxxxx',
  },
];

export default () => (
  <ProList
    toolBarRender={() => {
      return [
        <Button key="add" type="primary">
          新建
        </Button>,
      ];
    }}
    pagination={{
      defaultPageSize: 10,
      size: 'small',
    }}
    onRow={(record: any) => {
      return {
        onMouseEnter: () => {
          console.log(record);
        },
        onClick: () => {
          console.log(record);
        },
      };
    }}
    rowKey="name"
    headerTitle="集合列表"
    dataSource={dataSource}
    metas={{
      title: {
        dataIndex: 'name',
      },
      description: {
        dataIndex: 'desc',
      },
      actions: {
        render: () => [
          <Popconfirm key={'remove'} title="确认删除吗?">
            <Button size="small" key="link" type="link" danger>
              删除
            </Button>
          </Popconfirm>,
        ],
      },
    }}
  />
);
