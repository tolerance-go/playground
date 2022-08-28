import {
  EyeInvisibleOutlined,
  EyeOutlined,
  SwitcherOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Col, Row, Space } from 'antd';

export default () => {
  const { setExpanedKeys, showAllSlots, setShowAllSlots } = useModel(
    'workbench.comsLayout',
    (model) => ({
      setExpanedKeys: model?.setExpanedKeys,
      showAllSlots: model.showAllSlots,
      setShowAllSlots: model.setShowAllSlots,
    }),
  );

  return (
    <Row justify="end" align="middle">
      <Col>
        <Space size={5}>
          <Button
            icon={showAllSlots ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            size="small"
            type="text"
            onClick={() => {
              setShowAllSlots((prev) => !prev);
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
