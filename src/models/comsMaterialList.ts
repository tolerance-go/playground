import { useModel } from '@umijs/max';
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

export type ComMaterials = ComMaterial[];

const useComsMaterialList = () => {
  const [comsMaterialList, setComsMaterialList] = useState<ComMaterials>([]);

  const { removeTargetComsAndSaveTheirSettings } = useModel(
    'stageComponentsModel',
    (model) => {
      return {
        removeTargetComsAndSaveTheirSettings:
          model.removeTargetComsAndSaveTheirSettings,
      };
    },
  );

  const createComMaterial = useMemoizedFn(
    (name: string, rootIds: string[], desc?: string) => {
      setComsMaterialList(
        produce((draft) => {
          const newId = nanoid();
          draft.push({
            name,
            desc,
            id: newId,
            rootIds,
          });
        }),
      );
      removeTargetComsAndSaveTheirSettings(rootIds);
    },
  );

  const getComMaterial = useMemoizedFn((id: string) => {
    return comsMaterialList.find((item) => item.id === id);
  });

  return {
    comsMaterials: comsMaterialList,
    getComMaterial,
    setComsMaterials: setComsMaterialList,
    createComMaterial,
  };
};

export default useComsMaterialList;
