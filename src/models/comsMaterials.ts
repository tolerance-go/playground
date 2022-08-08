import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { useState } from 'react';

/** 组件物料 */
export type ComMaterial = {
  id: string;
  desc?: string;
  name: string;
  rootIds: string[];
};

export type ComMaterials = Record<string, ComMaterial>;

const useComsMaterials = () => {
  const [comsMaterials, setComsMaterials] = useState<ComMaterials>({});

  const createComMaterial = useMemoizedFn(
    (name: string, rootIds: string[], desc?: string) => {
      setComsMaterials(
        produce((draft) => {
          const newId = nanoid();
          draft[newId] = {
            name,
            desc,
            id: newId,
            rootIds,
          };
        }),
      );
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsMaterials,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn((from?: { comsMaterials: ComMaterials }) => {
    setComsMaterials(from?.comsMaterials ?? {});
  });

  return {
    comsMaterials,
    setComsMaterials,
    createComMaterial,
    getData,
    initData,
  };
};

export default useComsMaterials;
