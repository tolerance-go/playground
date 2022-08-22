import { useModel } from '@umijs/max';
import { Col, Divider, Row, Typography } from 'antd';
import CommentList from '../CommentList';
import { ParagraphItem } from '../ParagraphItem';
import { TitleItem } from '../TitleItem';

export const DiscussContent = () => {
  const { discussComments } = useModel('discussComments', (model) => ({
    discussComments: model.discussComments,
  }));

  const { selectedDiscuss } = useModel('playground', (model) => ({
    selectedDiscuss: model.selectedDiscuss,
  }));

  if (!selectedDiscuss) {
    return null;
  }

  return (
    <Row
      key={selectedDiscuss.id}
      style={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'stretch',
      }}
      wrap={false}
    >
      <Col
        flex={'300px'}
        style={{
          overflow: 'auto',
          paddingTop: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <TitleItem />
        <ParagraphItem />
      </Col>
      <Col
        flex={'none'}
        style={{
          paddingRight: 24,
          paddingLeft: 24,
        }}
      >
        <Typography.Text>{`${discussComments.length} 条评论 & 回复`}</Typography.Text>
        <Divider
          style={{
            marginTop: 12,
            marginBottom: 0,
          }}
        />
      </Col>
      <Col
        flex={'auto'}
        style={{
          overflow: 'auto',
          paddingRight: 24,
          paddingLeft: 24,
        }}
      >
        <CommentList discussId={selectedDiscuss.id} />
      </Col>
    </Row>
  );
};
