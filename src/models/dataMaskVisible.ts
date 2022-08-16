import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { RecoverParams } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

const useDataMaskVisible = () => {
  const [visible, setVisible] = useState(false);

  const recoverUpdatingRef = useRef(false);

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  useUpdateEffect(() => {
    if (recoverUpdatingRef.current) {
    } else {
      historyManager.commit([
        HistoryAreaNames.DataMaskVisible,
        {
          state: {
            visible,
          },
          commitInfo: undefined,
        },
      ]);
    }

    recoverUpdatingRef.current = false;
  }, [visible]);

  useEffect(() => {
    historyManager.registerArea({
      initialState: () => {
        return {
          visible: false,
        };
      },
      name: HistoryAreaNames.DataMaskVisible,
      /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
      recover: async ({
        state: currentState,
      }: RecoverParams<
        {
          visible: boolean;
        },
        undefined
      >) => {
        recoverUpdatingRef.current = true;
        setVisible(currentState.visible);

        return true;
      },
      backRecover: () => {},
    });
  }, []);

  return {
    visible,
    setVisible,
  };
};

export default useDataMaskVisible;
