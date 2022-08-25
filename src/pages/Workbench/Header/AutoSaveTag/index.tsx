import { useModel } from '@/.umi/plugin-model';
import { useAutoSave } from '@/hooks/initials/useAutoSave';
import { CloudOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { Popover, Space, Tooltip, Typography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import dayjs from 'dayjs';
import { PropsWithChildren, useEffect } from 'react';
import { HistoryCommitLine } from './HistoryCommitLine';
import styles from './index.less';

const Text = (props: PropsWithChildren<TextProps>) => {
  return (
    <Typography.Text
      {...props}
      type="secondary"
      style={{
        cursor: 'pointer',
      }}
    >
      {props.children}
    </Typography.Text>
  );
};

export const AutoSaveTag = () => {
  const { autoSaveLastTime } = useModel('app.stageAutoSave');

  const { loading } = useAutoSave();

  const { setPageListByVersionId } = useModel('page.pageList', (model) => ({
    setPageListByVersionId: model?.setPageListByVersionId,
  }));

  const [searchParams, setSearchParams] = useSearchParams();

  const { activeVersionId, setActiveVersionId } = useModel(
    'app.versionList',
    (model) => ({
      activeVersionId: model?.activeVersionId,
      setActiveVersionId: model?.setActiveVersionId,
    }),
  );

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get('versionId');
    if (id) {
      setActiveVersionId(Number(id));
    }
  }, []);

  useUpdateEffect(() => {
    /** 空值也需要设置，恢复默认状态 */
    /** 设置版本的 pageList */
    setPageListByVersionId(activeVersionId);

    /** 同步 url，下次刷新页面的时候可以记住 */
    if (activeVersionId) {
      searchParams.set('versionId', String(activeVersionId));
    } else {
      searchParams.delete('versionId');
    }
    setSearchParams(searchParams);
  }, [activeVersionId]);

  return (
    <Popover
      content={<HistoryCommitLine />}
      trigger={['click']}
      overlayClassName={styles.overlay}
    >
      <Tooltip title="查看修改记录">
        <Text>
          {autoSaveLastTime ? (
            <Space>
              <span>已保存 {dayjs(autoSaveLastTime).format('HH:mm:ss')}</span>
              <CloudOutlined spin={loading} />
            </Space>
          ) : (
            <span>已加载到最新状态</span>
          )}
        </Text>
      </Tooltip>
    </Popover>
  );
};
