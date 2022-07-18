import { useModel } from '@umijs/max';
import { Col, Divider, Row } from 'antd';
import ComTree from './ComTree';
import PagePanel from './PagePanel';
import Segmented from './Segmented';

export default () => {
  const { normalStatus } = useModel('siderLeftMode', (model) => ({
    normalStatus: model.normalStatus,
  }));
  return (
    <Row
      style={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'stretch',
        padding: 15,
      }}
      wrap={false}
    >
      <Col flex={'none'}>
        <Segmented />
      </Col>
      <Col flex={'none'}>
        <Divider
          style={{
            marginTop: 15,
            marginBottom: 15,
          }}
        ></Divider>
      </Col>
      <Col flex={'auto'}>
        {(() => {
          if (normalStatus === 'page') {
            return <PagePanel />;
          }
          if (normalStatus === 'layout') {
            return <ComTree />;
          }
          return <PagePanel />;
        })()}
      </Col>
    </Row>
  );
};
