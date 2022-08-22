import { ArrowRightOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Popconfirm, Select, Space } from 'antd';

export const DiscussActions = () => {
  const {
    requestResolvedDiscussLoading,
    selectedDiscuss,
    setDetailVisible,
    requestDeleteDiscuss,
    detailMode,
    requestResolvedDiscuss,
    detailListFilterMode,
    setDetailMode,
    setDetailListFilterMode,
    setSelectedDiscussId,
    selectedNextItem,
  } = useModel('playground', (model) => ({
    setDetailVisible: model.setDetailVisible,
    requestDeleteDiscuss: model.requestDeleteDiscuss,
    requestResolvedDiscuss: model.requestResolvedDiscuss,
    requestResolvedDiscussLoading: model.requestResolvedDiscussLoading,
    selectedDiscuss: model.selectedDiscuss,
    detailMode: model.detailMode,
    setDetailMode: model.setDetailMode,
    detailListFilterMode: model.detailListFilterMode,
    setDetailListFilterMode: model.setDetailListFilterMode,
    setSelectedDiscussId: model.setSelectedDiscussId,
    selectedNextItem: model.selectedNextItem,
  }));

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

  if (!selectedDiscuss) {
    return null;
  }

  return (
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
    </Space>
  );
};
