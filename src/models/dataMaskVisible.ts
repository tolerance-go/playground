import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { RecoverParams } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

const defaultVisible = false;

const useDataMaskVisible = () => {
  const [visible, setVisible] = useState(defaultVisible);

  const recoverUpdatingRef = useRef(false);

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const getVisible = useMemoizedFn(() => {
    return visible;
  });

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
        recoverUpdatingRef.current = true;
        setVisible(state.visible);

        return { success: true };
      },
    });
  }, []);

  return {
    visible,
    setVisible,
    getVisible,
  };
};

export default useDataMaskVisible;
