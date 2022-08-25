import { RelationTreeItem } from '@/utils/treeUtils/makeTreeWithRelation';
import { useModel } from '@umijs/max';
import { Dropdown, Menu } from 'antd';

export const TreeItem = ({
  record,
}: {
  record: RelationTreeItem<API.Component>;
}) => {
  const { requestRemove, requestCreate } = useModel(
    'component.componentList',
    (model) => ({
      requestRemove: model.requestRemove,
      requestCreate: model.requestCreate,
    }),
  );

  return (
    <Dropdown
      trigger={['contextMenu']}
      overlay={
        <Menu
          items={[
            {
              key: 'extend',
              label: '派生',
              onClick: () => {},
            },
            {
              key: 'remove',
              label: '删除',
              danger: true,
              onClick: () => {
                requestRemove(record.id);
              },
            },
          ]}
        />
      }
    >
      <div>{record.name}</div>
    </Dropdown>
  );
};
