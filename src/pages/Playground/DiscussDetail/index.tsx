import { SwapLeftOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Col, Drawer, Row, Space } from 'antd';
import CommentList from './CommentList';
import { ParagraphItem } from './ParagraphItem';
import { TitleItem } from './TitleItem';

export const DiscussDetail = () => {
  const { detailVisible, setDetailVisible } = useModel(
    'playground',
    (model) => ({
      detailVisible: model.detailVisible,
      setDetailVisible: model.setDetailVisible,
    }),
  );

  return (
    <Drawer
      placement="right"
      onClose={() => {
        setDetailVisible(false);
      }}
      destroyOnClose
      visible={detailVisible}
      bodyStyle={{
        padding: 0,
      }}
      extra={
        <Space>
          <Button icon={<SwapLeftOutlined />} shape="round">
            返回列表
          </Button>
          <Button type="primary" shape="round">
            解决
          </Button>
        </Space>
      }
    >
      <Row
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
          flex={'auto'}
          style={{
            overflow: 'auto',
            paddingRight: 24,
            paddingLeft: 24,
          }}
        >
          <CommentList />
        </Col>
      </Row>
    </Drawer>
  );
};
