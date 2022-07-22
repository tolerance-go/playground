import { EyeOutlined, SwitcherOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Col, Row, Space } from 'antd';

export default () => {
  const { setExpanedKeys } = useModel('comsLayout', (model) => ({
    setExpanedKeys: model.setExpanedKeys,
  }));

  return (
    <Row justify="end" align="middle">
      <Col>
        <Space size={5}>
          <Button
            // <EyeInvisibleOutlined />
            // EyeOutlined
            icon={<EyeOutlined />}
            size="small"
            type="text"
            onClick={() => {
              setExpanedKeys([]);
            }}
          ></Button>
          <Button
            icon={<SwitcherOutlined />}
            size="small"
            type="text"
            onClick={() => {
              setExpanedKeys([]);
            }}
          ></Button>
        </Space>
      </Col>
    </Row>
  );
};
