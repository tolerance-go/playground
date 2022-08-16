import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

const useDataMaskVisible = () => {
  const [visible, setVisible] = useState(false);

  const recoverUpdatingRef = useRef(false);

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const getVisible = useMemoizedFn(() => visible);

  useUpdateEffect(() => {
    if (recoverUpdatingRef.current) {
    } else {
      historyManager.commit();
    }

    recoverUpdatingRef.current = false;
  }, [visible]);

  useEffect(() => {
    historyManager.registerArea({
      name: HistoryAreaNames.DataMaskVisible,
      pull: () => {
        return {
          visible: getVisible(),
        };
      },
      /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
      recover: async (state?: { visible: boolean }) => {
        // await delay(1000);

        recoverUpdatingRef.current = true;
        setVisible(state?.visible ?? false);

        return true;
      },
      backLatestRecover: () => {},
    });
  }, []);

  return {
    visible,
    setVisible,
  };
};

export default useDataMaskVisible;
