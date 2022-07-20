import { joinSlotId } from '@/helps';
import { SelfTreeDataNode } from '@/models/comsLayout';
import { useModel } from '@umijs/max';
import { Col, Row, Tag, Tree } from 'antd';
import { useEffect, useMemo } from 'react';
import TreeActions from './TreeActions';
import TreeItemMenu from './TreeItemMenu';

export default () => {
  const { stageComponentsModel, rootIds } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
      rootIds: model.rootIds,
    }),
  );

  const {
    expanedKeys,
    selectedKeys,
    setSelectedNodes,
    setExpanedKeys,
    setSelectedKeys,
  } = useModel('comsLayout', (model) => ({
    expanedKeys: model.expanedKeys,
    setExpanedKeys: model.setExpanedKeys,
    selectedKeys: model.selectedKeys,
    setSelectedKeys: model.setSelectedKeys,
    selectedNodes: model.selectedNodes,
    setSelectedNodes: model.setSelectedNodes,
  }));

  const { setHoverNodeId } = useModel('hoverNodeId', (model) => ({
    setHoverNodeId: model.setHoverNodeId,
  }));

  const { setSelectNodeId } = useModel('selectNodeMeta', (model) => ({
    setSelectNodeId: model.setSelectNodeId,
  }));

  const treeData = useMemo(() => {
    const getTree = (
      ids: string[],
      parentId: string,
      slotName: string,
    ): SelfTreeDataNode[] => {
      return ids.map((id) => {
        const model = stageComponentsModel?.[id];
        if (!model) {
          throw new Error('model id is unknow');
        }
        return {
          title: (
            <TreeItemMenu
              comId={id}
              parentId={parentId}
              slotName={slotName}
              type="component"
            >
              <div>{model?.type}</div>
            </TreeItemMenu>
          ),
          key: model?.id,
          data: {
            type: 'component',
          },
          children: Object.keys(model?.slots ?? {}).map((slotName) => {
            const slotIds = model?.slots[slotName] ?? [];
            const slotGroupId = joinSlotId(model.id, slotName);
            return {
              title: (
                <TreeItemMenu
                  comId={id}
                  parentId={parentId}
                  slotName={slotName}
                  type="slots"
                >
                  <Tag>{slotName}</Tag>
                </TreeItemMenu>
              ),
              /** 插槽层的 key 是父节 id 和插槽拼接 */
              key: slotGroupId,
              children: getTree(slotIds, id, slotName),
              data: {
                type: 'slots',
              },
            };
          }),
        };
      });
    };
    return getTree(rootIds, 'root', 'root');
  }, [stageComponentsModel, rootIds]);

  useEffect(() => {
    if (selectedKeys?.length) {
      setSelectNodeId(String(selectedKeys[0]));
    } else {
      setSelectNodeId(undefined);
    }
  });

  return (
    <Row
      style={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'stretch',
      }}
      wrap={false}
    >
      <Col flex={'none'}>
        <TreeActions />
      </Col>
      <Col
        flex={'auto'}
        style={{
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <Tree<SelfTreeDataNode>
          expandedKeys={expanedKeys}
          draggable
          blockNode
          selectable
          selectedKeys={selectedKeys}
          treeData={treeData}
          onExpand={(keys) => {
            window.__consola.info('action:', '展开指定节点', keys);

            setExpanedKeys(keys);
          }}
          onMouseEnter={(info) => {
            setHoverNodeId(info.node.key as string);
          }}
          onMouseLeave={() => {
            setHoverNodeId(undefined);
          }}
          onSelect={(selectedKeys, info) => {
            setSelectedKeys(selectedKeys);
            setSelectedNodes(info.selectedNodes);
          }}
        />
      </Col>
    </Row>
  );
};
