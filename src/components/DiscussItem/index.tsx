import { DiscussTag } from '@/components/DiscussTag';
import { useModel } from '@umijs/max';
import { pick } from 'lodash';
import { memo } from 'react';
import { usePositionResize } from './usePositionResize';

const DiscussItem = (
  props: API.Discuss & {
    index: number;
  },
) => {
  const { setSelectedDiscussId, setDetailMode, selectedDiscussId } = useModel(
    'playground',
    (model) => ({
      setSelectedDiscussId: model.setSelectedDiscussId,
      selectedDiscussId: model.selectedDiscussId,
      setDetailMode: model.setDetailMode,
    }),
  );

  const { left, top, initResized } = usePositionResize({
    originLeft: props.left,
    originTop: props.top,
    ...pick(props, [
      'belongsToComId',
      'containerLeft',
      'containerTop',
      'containerWidth',
      'containerHeight',
    ]),
  });

  /** 监听组件状态，判断显示 */
  const { usedStatId } = useModel('page.statusSettingsUsed', (model) => ({
    usedStatId: model.statusSettingsUsed[props.belongsToComId],
  }));

  const { defaultStatId } = useModel('page.statusSettingsDefaults', (model) => ({
    defaultStatId: model.statusSettingsDefaults[props.belongsToComId],
  }));

  if ((usedStatId || defaultStatId) !== props.belongsToComStatId) {
    return null;
  }

  return initResized ? (
    <DiscussTag
      className="discussItem"
      type={selectedDiscussId === props.id ? 'primary' : 'default'}
      onClick={(event) => {
        /** 防止重复创建 temp */
        event.stopPropagation();
        setSelectedDiscussId(props.id);
        setDetailMode('detail');
      }}
      top={top}
      left={left}
    />
  ) : null;
};

export default memo(DiscussItem);
