import { Col, Row } from 'antd';
import EventCreator from './EventCreator';
import EventsList from './EventsList';

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
      <Col
        flex={'none'}
        style={{
          marginBottom: 10,
        }}
      >
        <EventCreator />
      </Col>
      <Col
        flex={'auto'}
        style={{
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <EventsList />
      </Col>
    </Row>
  );
};
