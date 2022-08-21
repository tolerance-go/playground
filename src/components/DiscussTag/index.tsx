import { BulbOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';

export const DiscussTag = (props: {
  top: number;
  left: number;
  type?: ButtonProps['type'];
  onClick?: ButtonProps['onClick'];
  className?: string;
}) => {
  return (
    <Button
      onClick={props.onClick}
      className={props.className}
      type={props.type}
      style={{
        position: 'absolute',
        top: props.top,
        left: props.left,
        transform: 'translate(-50%, -50%)',
      }}
      shape="circle"
      icon={<BulbOutlined />}
    ></Button>
  );
};
