import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';

export const useSelectedDataListItem = () => {
  const { dataList } = useModel('database.dataList', (model) => ({
    dataList: model.dataList,
  }));

  const { selectedDataId } = useModel('database.selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const selectedDataListItem = useMemo(() => {
    return dataList.find((item) => item.id === selectedDataId);
  }, [dataList, selectedDataId]);

  const getSeletedDataListItem = useMemoizedFn(() => {
    return selectedDataListItem;
  });

  return {
    selectedDataListItem,
    selectedDataId,
    getSeletedDataListItem,
  };
};
