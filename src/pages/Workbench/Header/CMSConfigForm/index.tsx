import { useModel } from '@umijs/max';
import { Col, Drawer, Row } from 'antd';
import List from './List';
import Sheet from './Sheet';
import { Trigger } from './Trigger';

export default () => {
  const { visible, setVisible } = useModel('dataMaskVisible', (model) => ({
    visible: model.visible,
    setVisible: model.setVisible,
  }));
  return (
    <>
      <Trigger />
      <Drawer
        push={false}
        visible={visible}
        title="数据管理"
        onClose={() => setVisible(false)}
        {...{
          placement: 'top',
          height: '90%',
        }}
      >
        <Row
          gutter={30}
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
