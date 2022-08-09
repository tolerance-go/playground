import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

/** 当 comsMaterialsRootIds 有值，则舞台渲染他们，作为物料展示 */
const useComsMaterials = () => {
  const [comsMaterialsRootIds, setComsMaterialsRootIds] = useState<string[]>();

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsMaterialsRootIds,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { comsMaterialsRootIds: string[] }) => {
      setComsMaterialsRootIds(from?.comsMaterialsRootIds);
    },
  );

  const cleanComsMaterialsRootIds = useMemoizedFn(() => {
    if (comsMaterialsRootIds !== undefined) {
      setComsMaterialsRootIds(undefined);
    }
  });

  return {
    comsMaterialsRootIds,
    cleanComsMaterialsRootIds,
    setComsMaterialsRootIds,
    getData,
    initData,
  };
};

export default useComsMaterials;
