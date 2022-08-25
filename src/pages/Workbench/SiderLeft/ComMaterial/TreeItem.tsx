import { RelationTreeItem } from '@/utils/treeUtils/makeTreeWithRelation';
import { useModel } from '@umijs/max';
import { Dropdown, Menu, Row, Tag, Tooltip, Typography } from 'antd';

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
    <Row justify="space-between" align="middle">
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
        <Tag>
          <Typography.Text mark={highlightId === record.id}>
            {record.name}
          </Typography.Text>
          {record.desc && (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {record.desc}
            </Typography.Paragraph>
          )}
        </Tag>
      </Dropdown>
      {record.usedInPageIds?.length ? (
        <Tooltip title={`当前组件被 ${record.usedInPageIds.length} 个页面使用`}>
          <Typography.Text type="secondary">
            {record.usedInPageIds.length}
          </Typography.Text>
        </Tooltip>
      ) : null}
    </Row>
  );
};
