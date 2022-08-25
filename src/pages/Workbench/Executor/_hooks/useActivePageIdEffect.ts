import { ElementTypeEnums, URL_STATE } from '@/constants/urlState';
import { useModel, useSearchParams } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { useEffect } from 'react';
import { useInitSatgeDataWithPage } from '../../../../hooks/initials/useInitSatgeDataWithPage';

/** 初始化 pageId，同步 pageId 到 url 状态 */
export const useActivePageIdEffect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { initSatgeDataWithPage } = useInitSatgeDataWithPage();

  const { activePageId, setActivePageId } = useModel(
    'page.pageList',
    (model) => ({
      activePageId: model?.activePageId,
      setActivePageId: model?.setActivePageId,
    }),
  );

  useEffect(() => {
    /** 根据 url 初始化当前激活的 pageId */
    const id = searchParams.get(URL_STATE.ELEMENT_ID);
    const type = searchParams.get(URL_STATE.ELEMENT_TYPE);

    if (id && type === ElementTypeEnums.Page) {
      setActivePageId(Number(id));
    }
  }, []);

  useUpdateEffect(() => {
    if (activePageId) {
      /** 同步 url，下次刷新页面的时候可以记住 */
      searchParams.set(URL_STATE.ELEMENT_ID, String(activePageId));
      searchParams.set(URL_STATE.ELEMENT_TYPE, ElementTypeEnums.Page);

      setSearchParams(searchParams);
      initSatgeDataWithPage(activePageId);
    }
  }, [activePageId]);
};
