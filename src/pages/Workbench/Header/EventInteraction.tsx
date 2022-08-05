import { Form, Switch } from 'antd';

export default () => {
  return (
    <Form.Item
      label="事件交互"
      style={{
        margin: 0,
      }}
    >
      <Switch checkedChildren="打开" unCheckedChildren="关闭" defaultChecked />
    </Form.Item>
  );
};
