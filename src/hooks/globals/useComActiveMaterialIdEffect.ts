import { useModel, useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';

export const useComActiveMaterialIdEffect = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { comActiveMaterialId, setComActiveMaterialId } = useModel(
    'comActiveMaterialId',
    (model) => {
      return {
        comActiveMaterialId: model.comActiveMaterialId,
        setComActiveMaterialId: model.setComActiveMaterialId,
      };
    },
  );

  const { setComsMaterialsRootIds } = useModel(
    'comsMaterialsRootIds',
    (model) => {
      return {
        setComsMaterialsRootIds: model.setComsMaterialsRootIds,
      };
    },
  );

  const { getComMaterial } = useModel('comsMaterialList', (model) => {
    return {
      getComMaterial: model.getComMaterial,
    };
  });

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get('materialId');
    if (id) {
      setComActiveMaterialId(id);
    }
  }, []);

  useUpdateEffect(() => {
    if (comActiveMaterialId) {
      /** 同步 url，下次刷新页面的时候可以记住 */
      searchParams.delete('materialId');
      searchParams.append('materialId', comActiveMaterialId);
      setSearchParams(searchParams);
    }
  }, [comActiveMaterialId]);

  useUpdateEffect(() => {
    if (comActiveMaterialId) {
      const material = getComMaterial(comActiveMaterialId);
      if (material) {
        setComsMaterialsRootIds(material.rootIds);
      }
    } else {
      setComsMaterialsRootIds(undefined);
    }
  }, [comActiveMaterialId]);
};
