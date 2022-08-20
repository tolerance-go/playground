import { ArrowRightOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useDebounce } from 'ahooks';
import {
  Button,
  Col,
  Drawer,
  Popconfirm,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import CommentList from './CommentList';
import DiscussList from './DiscussList';
import { ParagraphItem } from './ParagraphItem';
import { TitleItem } from './TitleItem';

export const DiscussDetail = () => {
  const {
    detailVisible,
    tempDiscuss,
    requestResolvedDiscussLoading,
    selectedDiscuss,
    setDetailVisible,
    getTempTitleEditing,
    requestDeleteDiscuss,
    detailMode,
    requestResolvedDiscuss,
    detailListFilterMode,
    setDetailMode,
    setDetailListFilterMode,
    setSelectedDiscussId,
    selectedNextItem,
    filterDiscusses,
  } = useModel('playground', (model) => ({
    detailVisible: model.detailVisible,
    setDetailVisible: model.setDetailVisible,
    tempDiscuss: model.tempDiscuss,
    getTempTitleEditing: model.getTempTitleEditing,
    requestDeleteDiscuss: model.requestDeleteDiscuss,
    requestResolvedDiscuss: model.requestResolvedDiscuss,
    requestResolvedDiscussLoading: model.requestResolvedDiscussLoading,
    selectedDiscuss: model.selectedDiscuss,
    detailMode: model.detailMode,
    setDetailMode: model.setDetailMode,
    detailListFilterMode: model.detailListFilterMode,
    setDetailListFilterMode: model.setDetailListFilterMode,
    filterDiscusses: model.filterDiscusses,
    setSelectedDiscussId: model.setSelectedDiscussId,
    selectedNextItem: model.selectedNextItem,
  }));

  const dtempDiscuss = useDebounce(tempDiscuss, {
    wait: 350,
  });

  return (
    <Drawer
      width={500}
      placement="right"
      onClose={() => {
        if (getTempTitleEditing()) return;
        setDetailVisible(false);
      }}
      destroyOnClose
      visible={detailVisible}
      bodyStyle={{
        padding: 0,
      }}
      title={(() => {
        if (detailMode === 'list') {
          return (
            <Typography.Text>{filterDiscusses.length} 条讨论</Typography.Text>
          );
        }
        return undefined;
      })()}
      extra={(() => {
        if (detailMode === 'list') {
          return (
            <Select
              onChange={(val) => setDetailListFilterMode(val)}
              value={detailListFilterMode}
              options={[
                {
                  label: '已解决',
                  value: 'resolved',
                },
                {
                  label: '未解决',
                  value: 'open',
                },
              ]}
            ></Select>
          );
        }

        return (detailVisible ? tempDiscuss : dtempDiscuss) ? undefined : (
          <Space>
            <Button
              icon={<SwapLeftOutlined />}
              shape="round"
              onClick={() => {
                setDetailMode('list');
                setSelectedDiscussId(undefined);
              }}
            >
              返回列表
            </Button>
            {selectedDiscuss ? (
              <>
                <Button
                  loading={requestResolvedDiscussLoading}
                  type={selectedDiscuss.resolved ? 'default' : 'primary'}
                  shape="round"
                  onClick={() => {
                    requestResolvedDiscuss(selectedDiscuss.id, {
                      resolved: !selectedDiscuss.resolved,
                    });
                  }}
                >
                  {selectedDiscuss.resolved ? '待解决' : '解决'}
                </Button>
                <Popconfirm
                  title="确认删除吗？"
                  okText="确认"
                  cancelText="取消"
                  placement="bottomRight"
                  onConfirm={() => {
                    requestDeleteDiscuss(selectedDiscuss.id);
                  }}
                >
                  <Button danger type="primary" shape="round">
                    删除
                  </Button>
                </Popconfirm>
                <Button
                  disabled={!selectedNextItem}
                  shape="round"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    if (selectedNextItem) {
                      setSelectedDiscussId(selectedNextItem.id);
                    }
                  }}
                >
                  下一个
                </Button>
              </>
            ) : null}
          </Space>
        );
      })()}
    >
      {detailMode === 'detail' ? (
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
      ) : (
        <DiscussList />
      )}
    </Drawer>
  );
};
