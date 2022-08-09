import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { useState } from 'react';

const useComsMaterialList = () => {
  const [comsMaterialList, setComsMaterialList] = useState<API.Component[]>();

  // const { removeTargetComsAndSaveTheirSettings } = useModel(
  //   'stageComponentsModel',
  //   (model) => {
  //     return {
  //       removeTargetComsAndSaveTheirSettings:
  //         model.removeTargetComsAndSaveTheirSettings,
  //     };
  //   },
  // );

  const createComMaterial = useMemoizedFn((newComMaterial: API.Component) => {
    setComsMaterialList(
      produce((draft) => {
        draft?.push(newComMaterial);
      }),
    );
    // removeTargetComsAndSaveTheirSettings(rootIds);
  });

  const removeComMaterial = useMemoizedFn((id: number) => {
    setComsMaterialList(
      produce((draft) => {
        if (draft) {
          const index = draft.findIndex((item) => item.id === id);
          if (index > -1) {
            draft.splice(index, 1);
          }
        }
      }),
    );
  });

  const getComMaterial = useMemoizedFn((id: number) => {
    return comsMaterialList?.find((item) => item.id === id);
  });

  return {
    comsMaterialList,
    removeComMaterial,
    getComMaterial,
    setComsMaterialList,
    createComMaterial,
  };
};

export default useComsMaterialList;
