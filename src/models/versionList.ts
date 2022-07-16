import { VersionControllerIndex } from '@/services/server/VersionController';
import { useRequest } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import qs from 'qs';
import { useState } from 'react';

/** 路径管理 */
const useVersionList = () => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const { appId } = query;

  const [list, setList] = useState<API.Version[]>();

  const [activeVersionId, setActiveVersionId] = useState<number>();

  const { loading, run } = useRequest(
    async () => {
      return VersionControllerIndex({
        appId: Number(appId),
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        setList(data);
      },
    },
  );

  /** 首部插入 */
  const pushFromStart = useMemoizedFn((item: API.Version) => {
    setList((prev) => [item, ...(prev ?? [])]);
  });

  /** 删除 */
  const deleteVersion = useMemoizedFn((version: API.Version) => {
    setList(
      produce((draft) => {
        const index = draft?.findIndex((item) => item.id === version.id);
        if (index !== undefined && index > -1) {
          draft?.splice(index, 1);
        }
      }),
    );
  });

  return {
    setActiveVersionId,
    activeVersionId,
    deleteVersion,
    runLoadList: run,
    data: list,
    loading,
    pushFromStart,
  };
};

export default useVersionList;
