import { useInitialState } from '@/hooks/useInitialState';
import { PageControllerIndex } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Menu, Skeleton } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import clsx from 'clsx';
import styles from './index.less';
import { MenuItem } from './MenuItem';
import { TempInput } from './TempInput';

const PageNav = () => {
  const { initialState } = useInitialState();

  const { pageList, setList } = useModel('page.pageList', (model) => ({
    pageList: model.pageList,
    setList: model.setList,
  }));

  const { activePageId, createPathing, setActivePageId } = useModel(
    'page.pageList',
    (model) => ({
      createPathing: model.createPathing,
      activePageId: model.activePageId,
      setActivePageId: model.setActivePageId,
    }),
  );

  const { loading } = useRequest(
    async () => {
      return PageControllerIndex({
        appId: initialState.appId,
      });
    },
    {
      onSuccess: (data) => {
        setList(data);
      },
    },
  );

  return (
    <Skeleton loading={loading}>
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
