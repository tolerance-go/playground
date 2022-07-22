import { useModel } from '@/.umi/plugin-model';
import { useSaveStage } from '@/hooks/useSaveStage';
import { CloudOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { useRequest, useUpdateEffect } from 'ahooks';
import { Popover, Space, Tooltip, Typography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import dayjs from 'dayjs';
import { PropsWithChildren, useEffect } from 'react';
import styles from './AutoSaveTag.less';
import HistoryList from './HistoryList';

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
  const { autoSaveLastTime, triggerSaveTime, updateAutoSaveTime } =
    useModel('stageAutoSave');

  const { saveStageComsData } = useSaveStage();

  const { setPageListByVersionId } = useModel('pageList', (model) => ({
    setPageListByVersionId: model?.setPageListByVersionId,
  }));

  const [searchParams, setSearchParams] = useSearchParams();

  const { activeVersionId, setActiveVersionId } = useModel(
    'versionList',
    (model) => ({
      activeVersionId: model?.activeVersionId,
      setActiveVersionId: model?.setActiveVersionId,
    }),
  );

  const { loading, run } = useRequest(
    async () => {
      const { success } = await saveStageComsData();

      if (success) {
        updateAutoSaveTime();
      }

      return { success };
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (triggerSaveTime) {
      run();
    }
  }, [triggerSaveTime]);

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
      content={<HistoryList />}
      trigger={['click']}
      overlayClassName={styles.overlay}
    >
      <Tooltip title="查看历史版本">
        <Text>
          {autoSaveLastTime ? (
            <Space>
              <span>已保存 {dayjs(autoSaveLastTime).format('HH:mm:ss')}</span>
              <CloudOutlined spin={loading} />
            </Space>
          ) : (
            <span>已加载到最新版本</span>
          )}
        </Text>
      </Tooltip>
    </Popover>
  );
};
