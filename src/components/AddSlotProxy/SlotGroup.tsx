import { useModel } from '@umijs/max';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import styles from './SlotGroup.less';

export default ({
  children,
  hasSlotsDom,
  slotGroupId,
}: PropsWithChildren<{
  hasSlotsDom: React.ReactNode;
  slotGroupId: string;
}>) => {
  const { hoverNodeId, setHoverNodeId } = useModel('hoverNodeId', (model) => ({
    hoverNodeId: model?.hoverNodeId,
    setHoverNodeId: model?.setHoverNodeId,
  }));

  const { stageSelectSlotGroupId, setStageSelectSlotGroupId } = useModel(
    'stageSelectSlotGroup',
    (model) => ({
      stageSelectSlotGroupId: model?.stageSelectSlotGroupId,
      setStageSelectSlotGroupId: model?.setStageSelectSlotGroupId,
    }),
  );

  const { setSelectedKeys } = useModel('comsLayout', (model) => ({
    setSelectedKeys: model?.setSelectedKeys,
  }));

  if (!hasSlotsDom || location.pathname === '/playground') {
    return <>{children}</>;
  }

  return (
    <div
      className={clsx(styles.wrap, {
        [styles.hover]: slotGroupId === hoverNodeId,
        [styles.selected]: slotGroupId === stageSelectSlotGroupId,
      })}
      style={{
        display: 'inline-block',
        padding: 8,
      }}
      onMouseEnter={(event) => {
        event.stopPropagation();
        if (slotGroupId !== hoverNodeId) {
          setHoverNodeId(slotGroupId);
        }
      }}
      onMouseOver={(event) => {
        event.stopPropagation();
        if (slotGroupId !== hoverNodeId) {
          setHoverNodeId(slotGroupId);
        }
      }}
      onMouseLeave={(event) => {
        event.stopPropagation();
        if (slotGroupId === hoverNodeId) {
          setHoverNodeId(undefined);
        }
      }}
      onClick={(event) => {
        setStageSelectSlotGroupId(slotGroupId);
        setSelectedKeys([slotGroupId]);

        /** 防止多层级的 Atom */
        event.stopPropagation();
      }}
    >
      {children}
    </div>
  );
};
