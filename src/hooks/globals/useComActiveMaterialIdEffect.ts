import { useModel, useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';
import { useInitSatgeDataWithMaterial } from '../initials/useInitSatgeDataWithMaterial';

export const useComActiveMaterialIdEffect = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { comActiveMaterialId, setComActiveMaterialId } = useModel(
    'component.activeId',
    (model) => {
      return {
        comActiveMaterialId: model.comActiveMaterialId,
        setComActiveMaterialId: model.setComActiveMaterialId,
      };
    },
  );

  const { initSatgeDataWithMaterial } = useInitSatgeDataWithMaterial();

  const { setActivePageId } = useModel('page.pageList', (model) => ({
    setActivePageId: model?.setActivePageId,
  }));

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get('materialId');
    if (id) {
      setComActiveMaterialId(Number(id));
      initSatgeDataWithMaterial(id);
    }
  }, []);

  useUpdateEffect(() => {
    if (comActiveMaterialId) {
      /** 同步 url，下次刷新页面的时候可以记住 */
      searchParams.delete('materialId');
      searchParams.append('materialId', String(comActiveMaterialId));
      searchParams.delete('pageId');
      setSearchParams(searchParams);
      setActivePageId(undefined);
    }
  }, [comActiveMaterialId]);

  useUpdateEffect(() => {
    if (comActiveMaterialId) {
      initSatgeDataWithMaterial(String(comActiveMaterialId));
    }
  }, [comActiveMaterialId]);
};
