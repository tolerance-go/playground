import { getURLQuery } from '@/helps/getURLQuery';
import {
  ComponentControllerCreate,
  ComponentControllerDestroy,
  ComponentControllerIndex,
} from '@/services/server/ComponentController';
import { convertListToMap } from '@/utils/listUtils/convertListToMap';
import { useMemoizedFn, useRequest } from 'ahooks';
import { produce } from 'immer';
import { useMemo, useState } from 'react';
import { getAppIdOrThrow } from './../../helps/getAppIdOrThrow';

const useComsMaterialList = () => {
  const [comsMaterialList, setComsMaterialList] =
    useState<API.ShownComponent[]>();

  const getComponentByIdOrThrow = useMemoizedFn((comId: number) => {
    const item = comsMaterialList?.find((item) => item.id === comId);
    if (item) {
      return item;
    }

    throw new Error('组件未找到');
  });

  const comsMaterialMap = useMemo(() => {
    return convertListToMap(comsMaterialList ?? []);
  }, [comsMaterialList]);

  const addComMaterial = useMemoizedFn((newComMaterial: API.ShownComponent) => {
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

  /** 默认拉取当前组件列表 */
  const { loading } = useRequest(
    async () => {
      const query = getURLQuery();
      const { appId } = query;

      return ComponentControllerIndex({
        appId: Number(appId),
      });
    },
    {
      onSuccess: (data) => {
        setComsMaterialList(data);
      },
    },
  );

  /** 删除组件 */
  const { loading: requestRemoveLoading, run: requestRemove } = useRequest(
    async (id: API.Component['id']) => {
      return ComponentControllerDestroy({
        id: String(id),
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (data?.id) {
          removeComMaterial(data?.id);
        }
      },
    },
  );

  /** 创建新组件 */
  const {
    loading: requestCreateComponentLoading,
    run: requestCreateComponent,
    runAsync: requestCreateComponentAsync,
  } = useRequest(
    async (params: Omit<API.CreationComponent, 'app_id'>) => {
      const appId = getAppIdOrThrow();
      return ComponentControllerCreate({
        name: params.name,
        desc: params.desc,
        app_id: appId,
        stage_data: params.stage_data,
        usedInPageIds: params.usedInPageIds,
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          addComMaterial(data);
        }
      },
    },
  );

  // const {
  //   loading: requestCreateAndInheritInFromCurrentLoading,
  //   run: requestCreateAndInheritInFromCurrent,
  // } = useRequest(
  //   async (mtlId: number) => {
  //     const current = comsMaterialMap[mtlId];
  //     return ComponentControllerCreate({
  //       name: current.name,
  //       desc: current.desc,
  //       app_id: appId as string,
  //       stage_data: current.stage_data,
  //     });
  //   },
  //   {
  //     manual: true,
  //     onSuccess: (data, params) => {
  //       if (data) {
  //         addComMaterial(data);
  //         requestCreateMaterialInheritRelation({
  //           toId: data!.id,
  //           fromId: params[0],
  //         });
  //       }
  //     },
  //   },
  // );

  /** 从当前物料创建，创建后继承该物料 */
  // const requestCreateAndInheritInFromCurrent = useMemoizedFn(
  //   async (mtlId: number) => {

  //   },
  // );

  return {
    getComponentByIdOrThrow,
    comsMaterialListLoading: loading,
    comsMaterialList,
    comsMaterialMap,
    removeComMaterial,
    getComMaterial,
    setComsMaterialList,
    addComMaterial,
    requestRemoveLoading,
    requestRemove,
    requestCreateComponentAsync,
    requestCreateComponent,
    requestCreateComponentLoading,
  };
};

export default useComsMaterialList;
