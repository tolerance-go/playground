import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { DataListItem } from '@/models/dataList';
import { DatabaseControllerUpdate } from '@/services/server/DatabaseController';
import { useModel } from '@umijs/max';
import { useMemoizedFn, usePrevious, useUpdateEffect } from 'ahooks';
import { message } from 'antd';
import { pick } from 'lodash';
import { useSelectedDataListItem } from '../useSelectedDataListItem';

export const useDataListUpdate = () => {
  const { selectedDataListItem, selectedDataId } = useSelectedDataListItem();

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const prevSelectedDataId = usePrevious(selectedDataId, () => true);

  const { getDataList, tagWithTriggerUpdateByRecoverUpdateDataListItemRef } =
    useModel('dataList', (model) => ({
      getDataList: model.getDataList,
      tagWithTriggerUpdateByRecoverUpdateDataListItemRef:
        model.tagWithTriggerUpdateByRecoverUpdateDataListItemRef,
    }));

  const selectedIdIsChange = useMemoizedFn(() => {
    return prevSelectedDataId !== selectedDataId;
  });

  const updateDatabase = useMemoizedFn(async (data: DataListItem) => {
    const { success } = await DatabaseControllerUpdate(
      {
        id: String(selectedDataId),
      },
      JSON.stringify(data.data ?? {}),
    );

    if (success) {
      if (tagWithTriggerUpdateByRecoverUpdateDataListItemRef.current) {
        tagWithTriggerUpdateByRecoverUpdateDataListItemRef.current = false;
      } else {
        historyManager.commit({
          [HistoryAreaNames.DataList]: {
            commitInfo: {
              type: 'updateDataListItem',
              data: pick(selectedDataListItem, ['id']),
            },
            state: getDataList(),
          },
        });
      }

      message.success('数据更新成功');
    }
  });

  useUpdateEffect(() => {
    if (selectedIdIsChange()) {
      return;
    }

    if (selectedDataListItem) {
      updateDatabase(selectedDataListItem);
    }
  }, [selectedDataListItem]);
};
