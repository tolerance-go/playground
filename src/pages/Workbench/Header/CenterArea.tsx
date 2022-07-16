import { VersionControllerShow } from '@/services/server/VersionController';
import { ExportOutlined } from '@ant-design/icons';
import { useModel, useRequest } from '@umijs/max';
import { Space, Tooltip } from 'antd';

export default () => {
  const { activeVersionId, setActiveVersionId } = useModel(
    'versionList',
    (model) => ({
      activeVersionId: model.activeVersionId,
      setActiveVersionId: model.setActiveVersionId,
    }),
  );

  const { data } = useRequest(
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

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {data ? (
        <Space size={'small'}>
          {data.name}
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
      ) : null}
    </div>
  );
};
