import { useInitSatgeData } from '@/hooks/useInitSatgeData';
import { useModel, useSearchParams } from '@umijs/max';
import { Menu, Skeleton } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import clsx from 'clsx';
import { useEffect } from 'react';
import styles from './index.less';
import { MenuItem } from './MenuItem';
import { TempInput } from './TempInput';

const PageNav = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { pageList, fetchListLoading } = useModel('pageList', (model) => ({
    pageList: model.pageList,
    fetchListLoading: model.fetchListLoading,
  }));

  const { activePageId, createPathing, setActivePageId } = useModel(
    'pageList',
    (model) => ({
      createPathing: model.createPathing,
      activePageId: model.activePageId,
      setActivePageId: model.setActivePageId,
    }),
  );

  const { initStageData } = useInitSatgeData();

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get('pageId');
    if (id) {
      setActivePageId(id);
    }
  }, []);

  useEffect(() => {
    if (activePageId) {
      /** 同步 url，下次刷新页面的时候可以记住 */
      searchParams.delete('pageId');
      searchParams.append('pageId', activePageId);
      setSearchParams(searchParams);

      initStageData(activePageId);
    }
  }, [activePageId]);

  return (
    <Skeleton loading={fetchListLoading}>
      <div className={styles.wrap}>
        <Menu
          selectedKeys={activePageId ? [activePageId] : undefined}
          mode="inline"
          items={(pageList ?? [])
            .map((item) => {
              console.log(item.id, activePageId);
              return {
                label: <MenuItem item={item} />,
                key: item.id,
                className: clsx({
                  'active-item': activePageId === String(item.id),
                }),
              } as ItemType;
            })
            .concat(
              createPathing
                ? [
                    {
                      key: 'creator',
                      label: <TempInput />,
                    },
                  ]
                : [],
            )}
          onClick={(info) => {
            setActivePageId(info.key);
          }}
        />
      </div>
    </Skeleton>
  );
};

export default PageNav;
