import { joinSlotId } from '@/helps';
import { SelfTreeDataNode } from '@/models/comsLayout';
import { useModel } from '@umijs/max';
import { Col, Row, Tag, Tree, TreeProps } from 'antd';
import { useEffect, useMemo } from 'react';
import TreeActions from './TreeActions';
import TreeItemMenu from './TreeItemMenu';

export default () => {
  const { stageComponentsModel, rootIds, moveComFromTree } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
      rootIds: model.rootIds,
      moveComFromTree: model.moveComFromTree,
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
            parentId,
            slotName,
            comId: model.id,
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
                /**
                 * 插槽的 comId 是所在组件的 id
                 * parentId 是指所在组件的父 id
                 */
                parentId,
                slotName,
                comId: model.id,
              },
            };
          }),
        };
      });
    };
    return getTree(rootIds, 'root', 'root');
  }, [stageComponentsModel, rootIds]);

  const onDrop: TreeProps<SelfTreeDataNode>['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    window.__consola.info('action:', 'droped', info, {
      dropKey,
      dragKey,
      dropPos,
      dropPosition,
    });

    // const loop = (data, key, callback) => {
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].key === key) {
    //       return callback(data[i], i, data);
    //     }

    //     if (data[i].children) {
    //       loop(data[i].children, key, callback);
    //     }
    //   }
    // };

    // const data = [...gData]; // Find dragObject

    // let dragObj;
    // loop(data, dragKey, (item, index, arr) => {
    //   arr.splice(index, 1);
    //   dragObj = item;
    // });

    if (!info.dropToGap) {
      window.__consola.info('action:', 'droped', '添加到头部', info);

      moveComFromTree({
        comId: info.dragNode.key as string,
        parentId: info.dragNode.data.parentId,
        slotName: info.dragNode.data.slotName,
        targetIndex: 0,
        targetComId: info.node.data.comId,
        targetSlotName: info.node.data.slotName,
      });
      // // Drop on the content
      // loop(data, dropKey, (item) => {
      //   item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置
      //   item.children.unshift(dragObj);
      // });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      window.__consola.info(
        'action:',
        'droped',
        '有子项，展开，底部空隙',
        info,
      );

      // loop(data, dropKey, (item) => {
      //   item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

      //   item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
      //   // item to the tail of the children
      // });
    } else {
      window.__consola.info('action:', 'droped', '其他', info);

      // let ar = [];
      // let i;
      // loop(data, dropKey, (_item, index, arr) => {
      //   ar = arr;
      //   i = index;
      // });

      // if (dropPosition === -1) {
      //   ar.splice(i, 0, dragObj);
      // } else {
      //   ar.splice(i + 1, 0, dragObj);
      // }
    }

    // setGData(data);
  };

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
          draggable={(node) => {
            const nodeData = node as unknown as SelfTreeDataNode;
            window.__consola.info('filter:', 'draggable', nodeData);

            return nodeData.data.type === 'component';
          }}
          allowDrop={(info) => {
            window.__consola.info('filter:', 'allowDrop', info);
            return (
              (info.dropNode.data.type === 'slots' &&
                info.dropPosition === 0) ||
              (info.dropNode.data.type === 'component' &&
                info.dropPosition === 1)
            );
          }}
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
          onDrop={onDrop}
        />
      </Col>
    </Row>
  );
};
