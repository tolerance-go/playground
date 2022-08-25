import { VersionControllerIndex } from '@/services/server/VersionController';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';

import { useMemoizedFn } from 'ahooks';
import consola from 'consola';
import { produce } from 'immer';
import qs from 'qs';
import { useEffect, useState } from 'react';

/** 路径管理 */
const useVersionList = () => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const { appId } = query;

  const [list, setList] = useState<API.Version[]>();

  const [activeVersionId, setActiveVersionId] = useState<number>();

  const { setSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    setSelectNodeId: model?.setStageSelectNodeId,
  }));

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

  /**
   * versionId 切换的时候，清空选中的舞台组件
   * 之前放在 SettingForm 中，导致点击后 mode 变化
   * SettingForm 重新渲染，useEffect 反复执行，所以
   * 放到上面一层组件
   */
  useEffect(() => {
    consola.info('版本切换清空选中组件', 'activeVersionId', activeVersionId);
    setSelectNodeId(undefined);
  }, [activeVersionId]);

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
