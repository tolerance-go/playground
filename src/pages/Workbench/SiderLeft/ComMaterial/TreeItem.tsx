import { RelationTreeItem } from '@/utils/treeUtils/makeTreeWithRelation';
import { useModel } from '@umijs/max';
import { Dropdown, Menu, Typography } from 'antd';

export const TreeItem = ({
  record,
}: {
  record: RelationTreeItem<API.Component>;
}) => {
  const { requestRemove, requestCreate } = useModel(
    'component.componentList',
    (model) => ({
      requestRemove: model.requestRemove,
      requestCreate: model.requestCreateComponent,
    }),
  );

  const { highlightId } = useModel(
    'component.listHighlightItemId',
    (model) => ({
      highlightId: model.highlightId,
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
      <div>
        <Typography.Text mark={highlightId === record.id}>
          {record.name}
        </Typography.Text>
      </div>
    </Dropdown>
  );
};
