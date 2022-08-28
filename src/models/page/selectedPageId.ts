import { getURLQuery } from '@/helps/getURLQuery';
import { useGetImmer } from '@/utils/useGetImmer';
import { useMemoizedFn } from 'ahooks';

export default () => {
  /** 当前激活的 page path */
  const [selectedPageId, setSelectedPageId] = useGetImmer<string | undefined>(
    () => getURLQuery().selectedPageId as string | undefined,
  );

  /** 设置 versionId 对应的 pageList */
  //   const setPageListByVersionId = useMemoizedFn(
  //     async (appId: string, versionId?: number) => {
  //       //   const data = await PageControllerIndex({
  //       //     appId: Number(appId),
  //       //     // versionId: versionId,
  //       //   });
  //       //   setList(data);
  //       //   if (data?.length) {
  //       //     setSelectedPageId(data[0].id);
  //       //   }
  //     },
  //   );

  const choosePageId = useMemoizedFn((id?: string) => {
    setSelectedPageId(id);
  });

  return {
    selectedPageId,
    choosePageId,
  };
};
