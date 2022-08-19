import { BulbOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const DiscussTag = (props: { top: number; left: number }) => {
  return (
    <Button
      style={{
        position: 'fixed',
        top: props.top,
        left: props.left,
      }}
      shape="circle"
      icon={<BulbOutlined />}
    ></Button>
  );
};
