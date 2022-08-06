import { DatabaseOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row } from 'antd';
import { useState } from 'react';
import List from './List';
import Sheet from './Sheet';

export default () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        type="text"
        icon={<DatabaseOutlined />}
        onClick={() => {
          setVisible(true);
        }}
      >
        数据
      </Button>
      <Drawer
        visible={visible}
        title="数据管理"
        onClose={() => setVisible(false)}
        {...{
          placement: 'top',
          height: '90%',
        }}
      >
        <Row
          gutter={20}
          wrap={false}
          style={{
            height: '100%',
          }}
          align="stretch"
        >
          <Col
            flex={'300px'}
            style={{
              borderRight: '1px solid #f2f2f2',
            }}
          >
            <List />
          </Col>
          <Col flex={'auto'}>
            <Sheet />
          </Col>
        </Row>
      </Drawer>
    </>
  );
};
