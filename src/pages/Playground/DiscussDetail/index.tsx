import {
  ArrowRightOutlined,
  CloseOutlined,
  SettingOutlined,
  SwapLeftOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Drawer, Popconfirm, Select, Space, Typography } from 'antd';
import { DiscussContent } from './DiscussContent';
import DiscussList from './DiscussList';
import styles from './index.less';

export const DiscussDetail = () => {
  const {
    detailVisible,
    tempDiscuss,
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
    filterDiscusses,
  } = useModel('playground', (model) => ({
    detailVisible: model.detailVisible,
    setDetailVisible: model.setDetailVisible,
    tempDiscuss: model.tempDiscuss,
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

  return (
    <>
      <div
        className={styles.drawerHandle}
        onClick={() => setDetailVisible(!detailVisible)}
        style={{
          zIndex: 999,
          position: 'fixed',
        }}
      >
        <SettingOutlined
          style={{
            color: '#fff',
            fontSize: 20,
          }}
        />
      </div>
      <Drawer
        mask={false}
        width={500}
        placement="right"
        onClose={() => {
          setDetailVisible(false);
        }}
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
        })()}
      >
        {detailMode === 'detail' ? <DiscussContent /> : <DiscussList />}
        <div
          className={styles.drawerHandle}
          onClick={() => setDetailVisible(!detailVisible)}
          style={{
            right: 500,
          }}
        >
          {detailVisible ? (
            <CloseOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          ) : (
            <SettingOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};
