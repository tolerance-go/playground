import { PageControllerIndex } from '@/services/server/PageController';
import { useGetImmer } from '@/utils/useGetImmer';
import { useMemoizedFn } from 'ahooks';
import qs from 'qs';
import { useState } from 'react';

/** 路径管理 */
const usePageList = () => {
  /** 当前激活的 page path */
  const [activePageId, setActivePageId] = useState<string>();
  const [list, setList, getList] = useGetImmer<API.ShownPage[]>();

  /** 尾部插入 */
  const pushPath = useMemoizedFn((item: API.ShownPage) => {
    setList((prev) => prev?.concat(item));
  });

  /** 删除 path */
  const deletePath = useMemoizedFn((page: API.ShownPage) => {
    setList((draft) => {
      const index = draft?.findIndex((item) => item.id === page.id);
      if (index !== undefined && index > -1) {
        draft?.splice(index, 1);
      }
    });
    // 如果删除的正在选中，同时清空选中
    if (page.id === activePageId) {
      setActivePageId(undefined);
    }
  });

  /** 更新 path */
  const updatePath = useMemoizedFn((id: string, page: API.UpdationPage) => {
    setList((draft) => {
      const target = draft?.find((item) => item.id === id);

      if (target) {
        Object.assign(target, page);
      }
    });
  });

  /** 复制 path */
  const copyPath = useMemoizedFn(
    (page: API.ShownPage, newPage: API.ShownPage) => {
      setList((draft) => {
        const index = draft?.findIndex((item) => item.id === page.id);
        if (index !== undefined && index > -1) {
          draft?.splice(index, 0, newPage);
        }
      });
    },
  );

  /** 设置 versionId 对应的 pageList */
  const setPageListByVersionId = useMemoizedFn(async (versionId?: number) => {
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const { appId } = query;

    const data = await PageControllerIndex({
      appId: Number(appId),
      // versionId: versionId,
    });

    setList(data);
    if (data?.length) {
      setActivePageId(data[0].id);
    }
  });

  return {
    pageList: list,
    // fetchListLoading: result.loading,
    activePageId,
    updatePath,
    getList,
    setList,
    setPageListByVersionId,
    copyPath,
    deletePath,
    pushPath,
    setActivePageId,
  };
};

export default usePageList;
