import { useInitialState } from '@/hooks/useInitialState';
import { PageControllerIndex } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Menu, Skeleton } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import clsx from 'clsx';
import { useLayoutEffect } from 'react';
import styles from './index.less';
import { MenuItem } from './MenuItem';
import { TempInput } from './TempCreateInput';

const PageNav = () => {
  const { initialState } = useInitialState();

  const { activePageId, pageList, setList, setActivePageId } = useModel(
    'page.pageList',
    (model) => ({
      activePageId: model.activePageId,
      pageList: model.pageList,
      setActivePageId: model.setActivePageId,
      setList: model.setList,
      getList: model.getList,
    }),
  );

  const { creatingMeta } = useModel('page.pageCreatingMeta', (model) => ({
    creatingMeta: model.creatingMeta,
  }));

  const { run, loading } = useRequest(
    async () => {
      return PageControllerIndex({
        appId: initialState.appId,
      });
    },
    {
      onSuccess: (data) => {
        setList(data);
      },
      loadingDelay: 300,
      manual: true,
    },
  );

  useLayoutEffect(() => {
    if (pageList === undefined) {
      run();
    }
  }, []);

  return (
    <Skeleton loading={loading}>
      <div className={styles.wrap}>
        <Menu
          selectedKeys={activePageId ? [activePageId] : undefined}
          mode="inline"
          items={(pageList ?? [])
            .map((item) => {
              return {
                label: <MenuItem item={item} />,
                key: item.id,
                className: clsx({
                  'active-item': activePageId === String(item.id),
                }),
              } as ItemType;
            })
            .concat(
              creatingMeta.isCreating
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
