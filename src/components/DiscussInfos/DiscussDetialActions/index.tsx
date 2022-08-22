import { ArrowRightOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, ButtonProps, Popconfirm, Space } from 'antd';

export const DiscussDetialActions = (props: { size?: ButtonProps['size'] }) => {
  const {
    requestResolvedDiscussLoading,
    selectedDiscuss,
    requestDeleteDiscuss,
    detailMode,
    requestResolvedDiscuss,
    detailListFilterMode,
    setDetailListFilterMode,
    setSelectedDiscussId,
    selectedNextItem,
    setDetailMode,
  } = useModel('playground', (model) => ({
    requestDeleteDiscuss: model.requestDeleteDiscuss,
    requestResolvedDiscuss: model.requestResolvedDiscuss,
    requestResolvedDiscussLoading: model.requestResolvedDiscussLoading,
    selectedDiscuss: model.selectedDiscuss,
    detailMode: model.detailMode,
    detailListFilterMode: model.detailListFilterMode,
    setDetailListFilterMode: model.setDetailListFilterMode,
    setSelectedDiscussId: model.setSelectedDiscussId,
    selectedNextItem: model.selectedNextItem,
    setDetailMode: model.setDetailMode,
  }));

  if (!selectedDiscuss) {
    return null;
  }

  return (
    <Space>
      <Button
        size={props.size}
        icon={<SwapLeftOutlined />}
        shape="round"
        onClick={() => {
          setDetailMode('list');
          setSelectedDiscussId(undefined);
        }}
      >
        返回列表
      </Button>
      <Button
        size={props.size}
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
        <Button size={props.size} danger type="primary" shape="round">
          删除
        </Button>
      </Popconfirm>
      <Button
        size={props.size}
        disabled={!selectedNextItem}
        shape="round"
        icon={<ArrowRightOutlined />}
        onClick={() => {
          if (selectedNextItem) {
            setSelectedDiscussId(selectedNextItem.id);
          }
        }}
      >
      </Button>
    </Space>
  );
};
