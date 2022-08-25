import { HistoryManager } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { Button, Empty, Timeline } from 'antd';
import dayjs from 'dayjs';

export const HistoryCommitLine = () => {
  const {
    snapshotsStack,
    index: current,
    cleanHistory,
  } = useModel('app.appStateHistory', (model) => ({
    snapshotsStack: model.snapshotsStack,
    index: model.index,
    cleanHistory: model.cleanHistory,
  }));

  return (
    <>
      <Button
        disabled={!snapshotsStack.length}
        style={{
          marginBottom: 20,
        }}
        block
        onClick={() => {
          cleanHistory();
        }}
      >
        清空历史记录
      </Button>
      {snapshotsStack.length ? (
        <div
          style={{
            maxHeight: 650,
            overflow: 'auto',
            padding: '10px 0',
            maxWidth: 400,
          }}
        >
          <Timeline>
            {[...snapshotsStack].reverse().map((item, index) => {
              return (
                <Timeline.Item
                  color={
                    snapshotsStack.length - current - 1 === index
                      ? 'blue'
                      : 'gray'
                  }
                  key={item.id}
                >
                  <p>
                    {item.id === HistoryManager.VirtualInitialNodeId
                      ? '初始化状态'
                      : dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                  {/* <pre>
                    {JSON.stringify(item.changedAreasSnapshots, null, 2)}
                  </pre>
                  --------------------------------
                  <pre>
                    {JSON.stringify(item.areasSnapshots, null, 2)}
                  </pre> */}
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      ) : (
        <Empty></Empty>
      )}
    </>
  );
};
