import { getURLQuery } from '@/helps/getURLQuery';
import { ComponentStructure } from '@/models/page/comsStructures';
import useGetImmer from '@/utils/useGetImmer';
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';

/** from 是被继承的，to 是继承者 */
export type MaterialInheritConnection = API.ShownComIheritRelation;

export type MaterialStructure = ComponentStructure & {
  // 被继承的组件 id
  inheritFromComId?: string;
};

/** 物料的继承关系数据 */
const useMaterialInheritRelation = () => {
  const query = getURLQuery();

  const [materialInheritConnection, setMaterialInheritConnection] = useGetImmer<
    MaterialInheritConnection[]
  >([]);

  const materialInheritConnectionMap = useMemo(() => {
    return materialInheritConnection.reduce(
      (acc, next) => ({ ...acc, [next.id]: next }),
      {},
    );
  }, [materialInheritConnection]);

  const addMaterialInheritConnection = useMemoizedFn(
    (data: API.ShownComIheritRelation) => {
      setMaterialInheritConnection((draft) => {
        draft.push(data);
      });
    },
  );

  const removeMaterialInheritConnection = useMemoizedFn((id: number) => {
    setMaterialInheritConnection((draft) => {
      draft.splice(
        draft.findIndex((item) => item.id === id),
        1,
      );
    });
  });

  const updateMaterialInheritConnection = useMemoizedFn(
    (id: number, data: API.UpdationComIheritRelation) => {
      setMaterialInheritConnection((draft) => {
        const target = draft[draft.findIndex((item) => item.id === id)];
        if (target) {
          Object.assign(target, data);
        }
      });
    },
  );

  return {
    materialInheritConnection,
    materialInheritConnectionMap,
    setMaterialInheritConnection,
    addMaterialInheritConnection,
    updateMaterialInheritConnection,
    removeMaterialInheritConnection,
  };
};

export default useMaterialInheritRelation;
