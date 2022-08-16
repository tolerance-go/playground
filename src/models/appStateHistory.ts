import { HistoryManager } from '@/domains/HistoryManager';
import { useRequest } from '@umijs/max';
import delay from 'delay';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const useAppStateHistory = () => {
  const [historyManager] = useState(new HistoryManager());
  const [reverting, setReverting] = useState(false);

  window.__historyManager = historyManager;

  useRequest(
    async () => {
      // 请求服务器历史记录
      await delay(1000);
    },
    {
      onSuccess: (snapshotsStack) => {
        historyManager.init([]);
      },
    },
  );

  useEffect(() => {
    /**
     * 当快照加载完毕，应该拿到顶部数据，通知所有 areas 进行 recover 一次，让一些不做持久化的状态，
     * 从初始化状态进入最近一次快照状态，比如 modal 的 visible
     */
    const initHandlerId = historyManager.listen('inited', () => {
      historyManager.move(0);
    });

    const revertingHandlerId = historyManager.listen('reverting', () => {
      setReverting(true);
    });

    const revertedHandlerId = historyManager.listen('reverted', () => {
      setTimeout(() => {
        setReverting(false);
      });
    });

    return () => {
      historyManager.unlisten('inited', initHandlerId);
      historyManager.unlisten('reverting', revertingHandlerId);
      historyManager.unlisten('reverted', revertedHandlerId);
    };
  }, []);

  /** 响应键盘事件 */
  useHotkeys('ctrl+z', () => {
    historyManager.revert();
  });

  useHotkeys('ctrl+shift+z', () => {
    historyManager.unRevert();
  });

  return {
    historyManager,
    reverting,
  };
};

export default useAppStateHistory;
