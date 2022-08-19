import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { RecoverParams } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';

const defaultVisible = false;

const useDataMaskVisible = () => {
  const [visible, setVisible] = useState(defaultVisible);

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const getVisible = useMemoizedFn(() => {
    return visible;
  });

  const open = useMemoizedFn(() => {
    setVisible(true);
    historyManager.commit({
      [HistoryAreaNames.DataMaskVisible]: {
        state: {
          visible: true,
        },
        commitInfo: 'open',
      },
    });
  });

  const close = useMemoizedFn(() => {
    setVisible(false);
    historyManager.commit({
      [HistoryAreaNames.DataMaskVisible]: {
        state: {
          visible: false,
        },
        commitInfo: 'close',
      },
    });
  });

  useEffect(() => {
    historyManager.registerArea({
      name: HistoryAreaNames.DataMaskVisible,
      getInitialState: () => {
        return {
          visible: defaultVisible,
        };
      },
      pull: () => {
        return {
          visible: getVisible(),
        };
      },
      /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
      recover: async ({
        state,
      }: RecoverParams<
        {
          visible: boolean;
        },
        undefined
      >) => {
        setVisible(state.visible);

        return { success: true };
      },
    });
  }, []);

  return {
    visible,
    getVisible,
    open,
    close,
  };
};

export default useDataMaskVisible;
