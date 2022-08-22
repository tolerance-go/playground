import { DiscussActions } from '@/components/DiscussInfos/DiscussActions';
import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Drawer, Typography } from 'antd';
import { PropsWithChildren } from 'react';
import styles from './index.less';

export const DiscussDrawer = (props: PropsWithChildren<{}>) => {
  const { detailVisible, setDetailVisible, detailMode, filterDiscusses } =
    useModel('playground', (model) => ({
      detailVisible: model.detailVisible,
      setDetailVisible: model.setDetailVisible,
      detailMode: model.detailMode,
      filterDiscusses: model.filterDiscusses,
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
        extra={<DiscussActions />}
      >
        {props.children}
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
