import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { RecoverParams } from '@/domains/HistoryManager';
import { useModel } from '@umijs/max';
import { useGetState, useMemoizedFn } from 'ahooks';
import { useEffect } from 'react';

/** 路径管理 */
const useSelectedDataId = () => {
  /** 当前激活的 page path */
  const [selectedDataId, setSelectedDataId, getSelectedDataId] =
    useGetState<number>();

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const selectWithDataId = useMemoizedFn((dataId?: number) => {
    setSelectedDataId(dataId);
    historyManager.commit({
      [HistoryAreaNames.SelectedDataListId]: {
        state: dataId,
        commitInfo: undefined,
      },
    });
  });

  useEffect(() => {
    historyManager.registerArea({
      name: HistoryAreaNames.SelectedDataListId,
      getInitialState: () => {
        return {
          selectedDataId: undefined,
        };
      },
      pull: () => {
        return {
          selectedDataId: getSelectedDataId(),
        };
      },
      /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
      recover: async ({
        state,
      }: RecoverParams<
        {
          selectedDataId: number | undefined;
        },
        undefined
      >) => {
        setSelectedDataId(state.selectedDataId);

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
