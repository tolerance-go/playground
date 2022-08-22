import { DiscussCountInfo } from '@/components/DiscussInfos/DiscussCountInfo';
import { DiscussDetialActions } from '@/components/DiscussInfos/DiscussDetialActions';
import { DiscussListActions } from '@/components/DiscussInfos/DiscussListActions';
import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Drawer } from 'antd';
import { PropsWithChildren } from 'react';
import styles from './index.less';

export const DiscussDrawer = (props: PropsWithChildren<{}>) => {
  const { detailVisible, setDetailVisible, detailMode } = useModel(
    'playground',
    (model) => ({
      detailVisible: model.detailVisible,
      setDetailVisible: model.setDetailVisible,
      detailMode: model.detailMode,
    }),
  );

  const width = 420;

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
        width={420}
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
            return <DiscussCountInfo />;
          }
          return undefined;
        })()}
        extra={
          detailMode === 'list' ? (
            <DiscussListActions />
          ) : (
            <DiscussDetialActions />
          )
        }
      >
        {props.children}
        <div
          className={styles.drawerHandle}
          onClick={() => setDetailVisible(!detailVisible)}
          style={{
            right: width,
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
