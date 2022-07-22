import { joinSlotGroupId } from '@/helps';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { TreeDataNode } from 'antd';
import utl from 'lodash';
import { useState } from 'react';

export type NormalStatus = 'page' | 'layout' | 'asset';

export type SelfTreeDataNode = TreeDataNode & {
  data: {
    type: string;
    parentId: string;
    slotName: string;
    comId: string;
  };
};

const useComsLayout = () => {
  const [expanedKeys, setExpanedKeys] = useState<React.Key[]>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();
  const [selectedNodes, setSelectedNodes] = useState<SelfTreeDataNode[]>();

  const { getLatestStageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => {
      return {
        getLatestStageComponentsModel: model.getLatestStageComponentsModel,
      };
    },
  );

  /** 层级打开指定的菜单 */
  const openTargetFromTreeMenu = useMemoizedFn((comId: string) => {
    const stageComponentsModel = getLatestStageComponentsModel();

    const findAllParentsId = (id: string, dist: string[] = []) => {
      if (id === 'root' || stageComponentsModel?.[id].parentId === 'root')
        return dist;
      const parentId = stageComponentsModel?.[id].parentId;

      if (parentId) {
        const slotName = stageComponentsModel?.[id].slotName;
        if (slotName) {
          dist.push(joinSlotGroupId(parentId, slotName));
        }

        dist.push(parentId);

        findAllParentsId(parentId, dist);
      }
      return dist;
    };

    window.__consola.info(
      'debug:',
      'findAllParentsId(targetId)',
      comId,
      findAllParentsId(comId),
    );
    setExpanedKeys((prev) =>
      utl.union((prev ?? []).concat(findAllParentsId(comId))),
    );
  });

  return {
    selectedKeys,
    expanedKeys,
    selectedNodes,
    setSelectedNodes,
    setSelectedKeys,
    setExpanedKeys,
    openTargetFromTreeMenu,
  };
};

export default useComsLayout;
