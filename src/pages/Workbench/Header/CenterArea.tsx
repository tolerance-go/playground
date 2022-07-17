import { VersionControllerShow } from '@/services/server/VersionController';
import { ExportOutlined } from '@ant-design/icons';
import { useModel, useRequest } from '@umijs/max';
import { Divider, Space, Spin, Tooltip, Typography } from 'antd';

export default () => {
  const { activeVersionId, setActiveVersionId } = useModel(
    'versionList',
    (model) => ({
      activeVersionId: model.activeVersionId,
      setActiveVersionId: model.setActiveVersionId,
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
      );
    }

    return <span>最新版本</span>;
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
      {
        <Space size={'small'}>
          <Typography.Text type="secondary">test</Typography.Text>
          <Divider type="vertical" />
          <Spin spinning={loading} size="small">
            {renderVersion()}
          </Spin>
        </Space>
      }
    </div>
  );
};
