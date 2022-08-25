import { useModel } from '@umijs/max';
import { Dropdown, Menu } from 'antd';
import { PropsWithChildren } from 'react';

export default ({
  children,
  comId,
  slotName,
  parentId,
  type,
}: PropsWithChildren<{
  comId: string;
  slotName: string;
  parentId: string;
  type: 'slots' | 'component';
}>) => {
  const { removeComFromTree, removeSlotFromTree } = useModel(
    'page.comsStructures',
    (model) => ({
      removeComFromTree: model?.removeComFromTree,
      removeSlotFromTree: model?.removeSlotFromTree,
    }),
  );

  const { refreshLastAutoSaveTime } = useModel('app.stageAutoSave', (model) => {
    return {
      refreshLastAutoSaveTime: model?.triggerPrepareSaveTimeChange,
    };
  });

  return (
    <Dropdown
      trigger={['contextMenu']}
      overlay={
        <Menu
          items={[
            {
              key: 'remove',
              label: '删除',
              onClick: () => {
                if (type === 'slots') {
                  removeSlotFromTree({
                    comId,
                    slotName,
                    parentId,
                  });
                } else if (type === 'component') {
                  removeComFromTree({
                    comId: comId,
                    slotName,
                    parentId,
                  });
                }
                refreshLastAutoSaveTime();
              },
            },
          ]}
        />
      }
    >
      {children}
    </Dropdown>
  );
};
