import { getURLQuery } from '@/helps/getURLQuery';
import {
  ComIheritRelationControllerCreate,
  ComIheritRelationControllerDestroy,
  ComIheritRelationControllerUpdate,
} from '@/services/server/ComIheritRelationController';
import useGetImmer from '@/utils/useGetImmer';
import { useMemoizedFn, useRequest } from 'ahooks';
import { useMemo } from 'react';
import { ComponentStructure } from '../comsStructures';

/** from 是被继承的，to 是继承者 */
export type MaterialInheritConnection = {
  id: number;
  fromId: number;
  toId: number;
  appId: number;
};

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

  const {
    loading: requestCreateMaterialInheritRelationLoading,
    run: requestCreateMaterialInheritRelation,
  } = useRequest(
    async (
      data: Omit<API.CreationComIheritRelation, 'appId'>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      opts?: {
        onSuccess?: (data: API.ShownComIheritRelation | undefined) => void;
      },
    ) => {
      return ComIheritRelationControllerCreate({
        ...data,
        appId: Number(query.appId),
      });
    },
    {
      manual: true,
      onSuccess(data, params) {
        params[1]?.onSuccess?.(data);
        if (data) {
          addMaterialInheritConnection(data);
        }
      },
    },
  );

  const {
    loading: requestDestroyMaterialInheritRelationLoading,
    run: requestDestroyMaterialInheritRelation,
  } = useRequest(
    async (
      id: number,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      opts?: {
        onSuccess?: (data: API.ShownComIheritRelation | undefined) => void;
      },
    ) => {
      return ComIheritRelationControllerDestroy({
        id,
      });
    },
    {
      manual: true,
      onSuccess(data, params) {
        params[1]?.onSuccess?.(data);
        if (data) {
          removeMaterialInheritConnection(data.id);
        }
      },
    },
  );

  const {
    loading: requestUpdateMaterialInheritRelationLoading,
    run: requestUpdateMaterialInheritRelation,
  } = useRequest(
    async (
      id: number,
      data: API.UpdationComIheritRelation,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      opts?: {
        disableAutoUpdateState?: boolean;
        onSuccess?: (data: API.ShownComIheritRelation | undefined) => void;
      },
    ) => {
      return ComIheritRelationControllerUpdate(
        {
          id,
        },
        data,
      );
    },
    {
      manual: true,
      onSuccess(data, params) {
        params[2]?.onSuccess?.(data);
        const disableAutoUpdateState =
          params[2]?.disableAutoUpdateState ?? false;
        if (data && disableAutoUpdateState === false) {
          const { id, ...rest } = data;
          updateMaterialInheritConnection(id, rest);
        }
      },
    },
  );

  return {
    materialInheritConnection,
    materialInheritConnectionMap,
    setMaterialInheritConnection,
    addMaterialInheritConnection,
    requestCreateMaterialInheritRelationLoading,
    requestCreateMaterialInheritRelation,
    removeMaterialInheritConnection,
    requestDestroyMaterialInheritRelationLoading,
    requestDestroyMaterialInheritRelation,
    requestUpdateMaterialInheritRelationLoading,
    requestUpdateMaterialInheritRelation,
  };
};

export default useMaterialInheritRelation;
