import { PageControllerDestroy } from '@/services/server/PageController';
import { EllipsisOutlined } from '@ant-design/icons';
import { useModel, useRequest } from '@umijs/max';
import { Button, Dropdown, Menu, Row, Spin } from 'antd';
import { useState } from 'react';

export const MenuItem = ({ item }: { item: API.Page }) => {
  const { deletePath, setCreatePathing, setTempInputValueByTarget } = useModel(
    'pageList',
    (model) => ({
      deletePath: model.deletePath,
      setCreatePathing: model.setCreatePathing,
      pushPath: model.pushPath,
      setTempInputValueByTarget: model.setTempInputValueByTarget,
    }),
  );

  const [hovering, setHovering] = useState(false);

  const { run: runDelete, loading: deleteLoading } = useRequest(
    async () => {
      return PageControllerDestroy({
        id: String(item.id),
      });
    },
    {
      manual: true,
      onSuccess: (page) => {
        if (page) {
          deletePath(page);
        }
      },
    },
  );

  return (
    <Row
      justify="space-between"
      align="middle"
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
    >
      <span>{item.path}</span>
      {hovering ? (
        <Dropdown
          trigger={['click']}
          overlay={
            <Spin spinning={deleteLoading}>
              <Menu
                onClick={(info) => {
                  if (info.key === 'delete') {
                    runDelete();
                  }
                  if (info.key === 'copy') {
                    setCreatePathing(true);
                    setTempInputValueByTarget(item);
                  }

                  /** 防止 Menu item active 变换 */
                  info.domEvent.stopPropagation();
                }}
                items={[
                  {
                    label: '设置',
                    key: 'settings',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    label: '修改路径',
                    key: 'change',
                  },
                  {
                    label: '复制',
                    key: 'copy',
                  },
                  {
                    label: '删除',
                    key: 'delete',
                  },
                ]}
              ></Menu>
            </Spin>
          }
        >
          <Button
            onClick={(e) => e.stopPropagation()}
            size="small"
            type="text"
            icon={<EllipsisOutlined />}
          ></Button>
        </Dropdown>
      ) : (
        <span></span>
      )}
    </Row>
  );
};
