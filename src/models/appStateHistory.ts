import { HISTORY_AREA_NAMES } from '@/constants/HistoryAreaNames';
import {
  HistoryManager,
  HistoryUpdateDataType,
} from '@/domains/HistoryManager';
import { getURLQuery } from '@/helps/getURLQuery';
import {
  AppControllerShow,
  AppControllerUpdateHistory,
} from '@/services/server/AppController';
import { useMemoizedFn, useRequest } from 'ahooks';
import utl from 'lodash';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { SnapshotsNode } from './../domains/HistoryManager';

const useAppStateHistory = () => {
  const [historyManager] = useState(
    () => new HistoryManager(utl.values(HISTORY_AREA_NAMES)),
  );
  const [reverting, setReverting] = useState(false);
  const [snapshotsStack, setSnapshotsStack] = useState<SnapshotsNode[]>([]);

  const [index, setIndex] = useState<number>(-1);

  window.__historyManager = historyManager;

  useRequest(
    async () => {
      const query = getURLQuery();

      if (query.appId) {
        // 请求服务器历史记录
        const data = await AppControllerShow({
          id: query.appId as string,
        });
        return data?.history_data && JSON.parse(data?.history_data);
      }
    },
    {
      onSuccess: (data: HistoryUpdateDataType | undefined) => {
        historyManager.init(data ?? {});
      },
    },
  );

  useEffect(() => {
    /**
     * 当快照加载完毕，应该拿到顶部数据，通知所有 areas 进行 recover 一次，让一些不做持久化的状态，
     * 从初始化状态进入最近一次快照状态，比如 modal 的 visible
     */
    const initHandlerId = historyManager.listen<HistoryUpdateDataType>(
      'inited',
      () => {
        historyManager.move(0);
      },
    );

    const updatedHandlerId = historyManager.listen('updated', (event) => {
      setSnapshotsStack(event.data.snapshotsStack);
      setIndex(event.data.index);

      const query = getURLQuery();

      if (query.appId) {
        AppControllerUpdateHistory(
          {
            id: query.appId as string,
          },
          JSON.stringify(event.data),
        );
      }
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
      historyManager.unlisten('updated', updatedHandlerId);
    };
  }, []);

  /** 响应键盘事件 */
  useHotkeys('ctrl+z', () => {
    historyManager.revert();
  });

  useHotkeys('ctrl+shift+z', () => {
    historyManager.unRevert();
  });

  const cleanHistory = useMemoizedFn(() => {
    setSnapshotsStack([]);
    setIndex(-1);

    historyManager.clean();
  });

  return {
    snapshotsStack,
    index,
    historyManager,
    reverting,
    cleanHistory,
  };
};

export default useAppStateHistory;
