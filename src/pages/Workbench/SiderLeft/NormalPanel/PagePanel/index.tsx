import { Col, Row, Typography } from 'antd';
import { PageCreator } from './PageCreator';
import PageNav from './PageNav';

export default () => {
  return (
    <Row
      style={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'stretch',
      }}
      wrap={false}
    >
      <Col flex={'none'}>
        <Row
          justify="space-between"
          align="middle"
          style={{
            background: '#fff',
            paddingBottom: 15,
          }}
        >
          <Col>
            <Typography.Text
              style={{
                fontSize: 14,
              }}
              strong
            >
              路径
            </Typography.Text>
          </Col>
          <Col>
            <PageCreator />
          </Col>
        </Row>
      </Col>
      <Col
        flex={'auto'}
        style={{
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <PageNav />
      </Col>
    </Row>
  );
};
