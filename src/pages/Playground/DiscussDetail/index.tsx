import { Drawer, Typography } from 'antd';
import CommentList from './CommentList';

export const DiscussDetail = () => {
  return (
    <Drawer
      placement="right"
      visible
      title={
        <Typography.Title
          level={5}
          editable
          ellipsis
          style={{
            width: 'calc(100% - 15px)',
            marginBottom: 0,
          }}
        >
          可以色彩在显眼一点吗
        </Typography.Title>
      }
    >
      <div>
        <Typography.Paragraph
          editable
          ellipsis={{
            rows: 3,
            expandable: true,
            symbol: '更多',
          }}
        >
          要连接到数据库,必须创建一个 Sequelize 实例.
          这可以通过将连接参数分别传递到 Sequelize数分别传递到 Seq数分别传递到
          Seq 构造函数或通过传递一个连接 URI 来完成：
        </Typography.Paragraph>
      </div>
      <CommentList />
    </Drawer>
  );
};
