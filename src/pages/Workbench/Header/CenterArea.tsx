import { VersionControllerShow } from '@/services/server/VersionController';
import { CloseOutlined, ExportOutlined } from '@ant-design/icons';
import { useModel, useRequest } from '@umijs/max';
import { Divider, Space, Spin, Tag, Tooltip, Typography } from 'antd';

export default () => {
  const { activeVersionId, setActiveVersionId } = useModel(
    'versionList',
    (model) => ({
      activeVersionId: model?.activeVersionId,
      setActiveVersionId: model?.setActiveVersionId,
    }),
  );

  const { data, loading } = useRequest(
    async () => {
      if (!activeVersionId) {
        return;
      }
      return VersionControllerShow({
        id: String(activeVersionId),
      });
    },
    {
      refreshDeps: [activeVersionId],
    },
  );

  const renderVersion = () => {
    if (data) {
      return (
        <Tag>
          <Space size={'small'}>
            {data?.name}
            <Tooltip title="退出当前版本状态">
              <ExportOutlined
                onClick={() => {
                  setActiveVersionId(undefined);
                }}
                style={{
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          </Space>
        </Tag>
      );
    }

    return <Tag>最新未发布</Tag>;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Space size={'small'}>
        <Typography.Text type="secondary">
          1000{' '}
          <CloseOutlined
            style={{
              fontSize: 10,
            }}
          />{' '}
          600
        </Typography.Text>
        {/* <Space>
          <InputNumber
            style={{
              width: 110,
            }}
            addonBefore="宽"
            size="small"
          ></InputNumber>
          <CloseOutlined
            style={{
              fontSize: 10,
            }}
          />
          <InputNumber
            style={{
              width: 110,
            }}
            addonBefore="高"
            size="small"
          ></InputNumber>
        </Space> */}
        <Divider type="vertical" />
        <Typography.Text
          style={{
            marginRight: 10,
          }}
          type="secondary"
        >
          test
        </Typography.Text>
        <Spin spinning={loading} size="small">
          {renderVersion()}
        </Spin>
      </Space>
    </div>
  );
};
