import { useModel } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useMemo } from 'react';

export default () => {
  const { initData } = useModel('page.comsStructures', (model) => ({
    initData: model.initData,
  }));

  const { pageList } = useModel('page.pageList', (model) => ({
    pageList: model.pageList,
  }));

  const { selectedPageId } = useModel('page.selectedPageId', (model) => ({
    selectedPageId: model.selectedPageId,
  }));

  const selectedPage = useMemo(
    () => pageList?.find((item) => item.id === selectedPageId),
    [pageList, selectedPageId],
  );

  /** 选中页面变化后，同步修改舞台相关状态 */
  useUpdateEffect(() => {
    initData(selectedPage?.nodesStructures as any);
  }, [selectedPage]);
};
