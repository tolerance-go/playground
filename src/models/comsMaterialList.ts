import { ComponentControllerIndex } from '@/services/server/ComponentController';
import { useRequest } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import qs from 'qs';
import { useState } from 'react';

const useComsMaterialList = () => {
  const [comsMaterialList, setComsMaterialList] = useState<API.Component[]>();

  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const { appId } = query;

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

  const { loading } = useRequest(
    async () => {
      return await ComponentControllerIndex({
        appId: Number(appId),
      });
    },
    {
      onSuccess: (data) => {
        setComsMaterialList(data);
      },
    },
  );

  return {
    comsMaterialListLoading: loading,
    comsMaterialList,
    removeComMaterial,
    getComMaterial,
    setComsMaterialList,
    createComMaterial,
  };
};

export default useComsMaterialList;
