import { useModel } from '@umijs/max';
import { Tag, Tree, TreeDataType } from 'antd';
import { useMemo } from 'react';

export default () => {
  const { stageComponentsModel, rootIds } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
      rootIds: model.rootIds,
    }),
  );

  const { expanedKeys, setExpanedKeys } = useModel('comsLayout', (model) => ({
    expanedKeys: model.expanedKeys,
    setExpanedKeys: model.setExpanedKeys,
  }));

  const { setHoverNodeId } = useModel('hoverNodeId', (model) => ({
    setHoverNodeId: model.setHoverNodeId,
  }));

  const { setSelectNodeId } = useModel('selectNodeMeta', (model) => ({
    setSelectNodeId: model.setSelectNodeId,
  }));

  const treeData = useMemo(() => {
    const getTree = (ids: string[]): TreeDataType[] => {
      return ids.map((id) => {
        const model = stageComponentsModel?.[id];
        return {
          title: <div>{model?.type}</div>,
          key: model?.id,
          children: Object.keys(model?.slots ?? {}).map((slotName) => {
            const slotIds = model?.slots[slotName] ?? [];
            return {
              title: <Tag>{slotName}</Tag>,
              key: `${model?.id}-${slotName}`,
              children: getTree(slotIds),
            };
          }),
        };
      });
    };
    return getTree(rootIds);
  }, [stageComponentsModel, rootIds]);

  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Tree
        expandedKeys={expanedKeys}
        draggable
        blockNode
        selectable
        treeData={treeData}
        onExpand={setExpanedKeys}
        onMouseEnter={(info) => {
          setHoverNodeId(info.node.key);
        }}
        onMouseLeave={() => {
          setHoverNodeId(undefined);
        }}
        onSelect={(selectedKeys, info) => {
          setSelectNodeId(info.node.key);
        }}
      />
    </div>
  );
};
