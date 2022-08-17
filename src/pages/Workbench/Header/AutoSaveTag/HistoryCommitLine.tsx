import { HistoryManager } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { Timeline } from 'antd';
import dayjs from 'dayjs';

export const HistoryCommitLine = () => {
  const {
    snapshotsStack,
    index: current,
    virtualInitialNode,
  } = useModel('appStateHistory', (model) => ({
    snapshotsStack: model.snapshotsStack,
    index: model.index,
    virtualInitialNode: model.virtualInitialNode,
  }));

  return (
    <Timeline>
      {snapshotsStack
        .reverse()
        .concat(virtualInitialNode ?? [])
        .map((item, index) => {
          return (
            <Timeline.Item
              color={
                snapshotsStack.length - current - 1 === index ? 'blue' : 'gray'
              }
              key={item.id}
            >
              <p>
                {item.id === HistoryManager.VirtualInitialNodeId
                  ? '初始化状态'
                  : dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </p>
            </Timeline.Item>
          );
        })}
    </Timeline>
  );
};
