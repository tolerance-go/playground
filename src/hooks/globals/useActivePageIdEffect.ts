import { useModel, useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';
import { useInitSatgeDataWithPage } from '../useInitSatgeDataWithPage';

/** 初始化 pageId，同步 pageId 到 url 状态 */
export const useActivePageIdEffect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { initSatgeDataWithPage } = useInitSatgeDataWithPage();

  const { activePageId, setActivePageId } = useModel('pageList', (model) => ({
    activePageId: model?.activePageId,
    setActivePageId: model?.setActivePageId,
  }));

  const { setComActiveMaterialId } = useModel(
    'comActiveMaterialId',
    (model) => {
      return {
        setComActiveMaterialId: model.setComActiveMaterialId,
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
      searchParams.delete('materialId');
      searchParams.append('pageId', activePageId);
      setSearchParams(searchParams);
      setComActiveMaterialId(undefined);

      initSatgeDataWithPage(activePageId);
    }
  }, [activePageId]);
};
