import { useMemoizedFn } from 'ahooks';
/** 切换物料和页面数据 */
export const useSwitchMaterialAndPage = () => {
  const switchToMaterialById = useMemoizedFn((materialId: string) => {});

  const switchToPageById = useMemoizedFn((pageId: string) => {});
};
