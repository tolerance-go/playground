import { useModel } from '@umijs/max';
import { Col, Divider, Row, Typography } from 'antd';
import CommentList from '../CommentList';
import { DiscussDetialActions } from '../DiscussDetialActions';
import { ParagraphItem } from './ParagraphItem';
import { TagItem } from './TagItem';
import { TitleItem } from './TitleItem';

export const DiscussContent = () => {
  const { discussComments } = useModel('discuss.discussComments', (model) => ({
    discussComments: model.discussComments,
  }));

  const { selectedDiscuss } = useModel('playground', (model) => ({
    selectedDiscuss: model.selectedDiscuss,
  }));

  if (!selectedDiscuss) {
    return null;
  }

  const gap = location.pathname === '/workbench' ? 14 : 24;

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
      {location.pathname === '/workbench' ? (
        <Col flex={'none'}>
          <Row
            justify="end"
            style={{
              marginBottom: 10,
            }}
          >
            <DiscussDetialActions size="small" />
          </Row>
        </Col>
      ) : null}
      <Col
        flex={'350px'}
        style={{
          overflow: 'auto',
          paddingTop: gap,
          paddingLeft: gap,
          paddingRight: gap,
        }}
      >
        <TitleItem />
        <TagItem />
        <ParagraphItem />
      </Col>
      <Col
        flex={'none'}
        style={{
          paddingRight: gap,
          paddingLeft: gap,
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
          paddingRight: gap,
          paddingLeft: gap,
        }}
      >
        <CommentList discussId={selectedDiscuss.id} />
      </Col>
    </Row>
  );
};
