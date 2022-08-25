import { PageControllerIndex } from '@/services/server/PageController';
import { useMemoizedFn, useRequest } from 'ahooks';
import { message } from 'antd';
import produce from 'immer';
import qs from 'qs';
import { useState } from 'react';

/** 路径管理 */
const usePageList = () => {
  /** 当前激活的 page path */
  const [activePageId, setActivePageId] = useState<number>();

  /** 当前是否正在创建新的 path */
  const [createPathing, setCreatePathing] = useState<boolean>(false);

  const [list, setList] = useState<API.Page[]>();

  const [tempInputValue, setTempInputValue] = useState<string>();

  const { loading } = useRequest(
    async () => {
      const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      const { appId, versionId } = query;

      if (!appId) {
        message.warn('query appId 缺失');
        return;
      }

      return PageControllerIndex({
        appId: Number(appId),
        versionId: versionId ? Number(versionId) : undefined,
      });
    },
    {
      onSuccess: (data) => {
        setList(data);
      },
    },
  );

  /** 尾部插入 */
  const pushPath = useMemoizedFn((item: API.Page) => {
    setList((prev) => prev?.concat(item));
  });

  /** 删除 path */
  const deletePath = useMemoizedFn((page: API.Page) => {
    setList(
      produce((draft) => {
        const index = draft?.findIndex((item) => item.id === page.id);
        if (index !== undefined && index > -1) {
          draft?.splice(index, 1);
        }
      }),
    );
  });

  /** 复制 path */
  const copyPath = useMemoizedFn((page: API.Page, newPage: API.Page) => {
    setList(
      produce((draft) => {
        const index = draft?.findIndex((item) => item.id === page.id);
        if (index !== undefined && index > -1) {
          draft?.splice(index, 0, newPage);
        }
      }),
    );
  });

  /** 设置输入框的 value，根据 list 下标 */
  const setTempInputValueByIndex = useMemoizedFn(() => {
    setTempInputValue(`/page${(list ?? []).length}`);
  });

  /** 设置输入框 value，根据点击的对象 */
  const setTempInputValueByTarget = useMemoizedFn((target: API.Page) => {
    setTempInputValue(`${target.path}-2`);
  });

  /** 设置 versionId 对应的 pageList */
  const setPageListByVersionId = useMemoizedFn(async (versionId?: number) => {
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const { appId } = query;

    const data = await PageControllerIndex({
      appId: Number(appId),
      versionId: versionId,
    });

    setList(data);
    if (data?.length) {
      setActivePageId(data[0].id);
    }
  });

  return {
    pageList: list,
    fetchListLoading: loading,
    activePageId,
    createPathing,
    tempInputValue,
    setPageListByVersionId,
    setTempInputValueByIndex,
    setTempInputValue,
    setTempInputValueByTarget,
    copyPath,
    deletePath,
    pushPath,
    setCreatePathing,
    setActivePageId,
  };
};

export default usePageList;
