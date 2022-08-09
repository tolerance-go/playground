import { useModel, useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';
import { useInitSatgeDataWithPage } from '../useInitSatgeDataWithPage';

export const useActivePageIdEffect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { initSatgeDataWithPage: initStageData } = useInitSatgeDataWithPage();

  const { activePageId, setActivePageId } = useModel('pageList', (model) => ({
    activePageId: model?.activePageId,
    setActivePageId: model?.setActivePageId,
  }));

  const { cleanComsMaterialsRootIds } = useModel(
    'comsMaterialsRootIds',
    (model) => {
      return {
        cleanComsMaterialsRootIds: model.cleanComsMaterialsRootIds,
      };
    },
  );

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get('pageId');
    if (id) {
      setActivePageId(id);
    }
  }, []);

  useUpdateEffect(() => {
    if (activePageId) {
      /** 同步 url，下次刷新页面的时候可以记住 */
      searchParams.delete('pageId');
      searchParams.append('pageId', activePageId);
      setSearchParams(searchParams);

      initStageData(activePageId);

      cleanComsMaterialsRootIds();
    }
  }, [activePageId]);
};
