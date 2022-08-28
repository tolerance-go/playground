import { ElementTypeEnums, URL_STATE } from '@/constants/urlState';
import { useModel, useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';
import { useInitSatgeDataWithMaterial } from '../../../hooks/initials/useInitSatgeDataWithMaterial';

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

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get(URL_STATE.ELEMENT_ID);
    const type = searchParams.get(URL_STATE.ELEMENT_TYPE);

    if (id && type === ElementTypeEnums.Component) {
      setComActiveMaterialId(Number(id));
    }
  }, []);

  useUpdateEffect(() => {
    if (comActiveMaterialId) {
      /** 同步 url，下次刷新页面的时候可以记住 */
      searchParams.set(URL_STATE.ELEMENT_ID, String(comActiveMaterialId));
      searchParams.set(URL_STATE.ELEMENT_TYPE, ElementTypeEnums.Component);

      setSearchParams(searchParams);

      initSatgeDataWithMaterial(comActiveMaterialId);
    }
  }, [comActiveMaterialId]);
};
