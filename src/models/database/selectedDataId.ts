import { HISTORY_AREA_NAMES } from '@/constants/HistoryAreaNames';
import { RecoverParams } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { useGetState, useMemoizedFn } from 'ahooks';
import { useEffect } from 'react';

const useSelectedDataId = () => {
  /** 当前激活的 page path */
  const [selectedDataId, setSelectedDataId, getSelectedDataId] =
    useGetState<number>();

  const { historyManager } = useModel('app.appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const selectWithDataId = useMemoizedFn((dataId?: number) => {
    setSelectedDataId(dataId);
    historyManager.commit({
      [HISTORY_AREA_NAMES.SELECTED_DATA_LIST_ID]: {
        state: dataId,
        commitInfo: undefined,
      },
    });
  });

  useEffect(() => {
    historyManager.registerArea({
      name: HISTORY_AREA_NAMES.SELECTED_DATA_LIST_ID,
      getInitialState: () => {
        return undefined;
      },
      pull: () => {
        return getSelectedDataId();
      },
      /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
      recover: async ({
        state,
      }: RecoverParams<number | undefined, undefined>) => {
        setSelectedDataId(state);

        return { success: true };
      },
    });
  }, []);

  return {
    selectedDataId,
    selectWithDataId,
    setSelectedDataId,
  };
};

export default useSelectedDataId;
