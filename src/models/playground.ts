import { getPageIdOrThrow } from '@/helps/getPageIdOrThrow';
import {
  DiscussControllerCreate,
  DiscussControllerDestroy,
  DiscussControllerIndex,
  DiscussControllerUpdate,
} from '@/services/server/DiscussController';
import { useRequest } from 'ahooks';

import { useGetState, useLatest, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { produce } from 'immer';
import { useMemo, useState } from 'react';

export type PlaygroundMode = 'cursor' | 'discuss';

export type Discuss = API.ShownDiscuss;

export type TempDiscuss = Omit<Discuss, 'id' | 'createdAt' | 'updatedAt'> & {
  createdSuccess?: boolean;
  id?: number;
};

export type Comment = {
  id: number;
  discuss_id: number;
  replyTo: number;
  content: string;
};

/** 当前 page 下的评论 */
const usePlayground = () => {
  const [mode, setMode] = useState<PlaygroundMode>('cursor');
  const [discusses, setDiscusses] = useState<Discuss[]>([]);
  const [selectedDiscussId, setSelectedDiscussId, getSelectedDiscussId] =
    useGetState<number>();

  /** 临时创建的讨论 */
  const [tempDiscuss, setTempDiscuss, getTempDiscuss] =
    useGetState<TempDiscuss>();

  const [detailVisible, setDetailVisible, getDetailVisible] =
    useGetState(false);

  const [detailMode, setDetailMode] = useState<'list' | 'detail'>('detail');
  const [detailListFilterMode, setDetailListFilterMode] = useState<
    'resolved' | 'open'
  >('open');

  /** 选中 item 所在 filterItems 的下标 */
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>();

  const selectedDiscuss = useMemo(() => {
    return discusses.find((item) => item.id === selectedDiscussId);
  }, [discusses, selectedDiscussId]);

  const filterDiscusses = useMemo(() => {
    return discusses.filter((item) => {
      if (detailListFilterMode === 'open') {
        return item.resolved === false;
      }
      return item.resolved;
    });
  }, [discusses, detailListFilterMode]);

  const filterDiscussesRef = useLatest(filterDiscusses);

  const selectedDiscussRef = useLatest(selectedDiscuss);

  const deleteDiscuss = useMemoizedFn((id: number) => {
    setDiscusses(
      produce((draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index > -1) {
          draft.splice(index, 1);
        }
      }),
    );
  });

  const addDiscuss = useMemoizedFn((data: Discuss) => {
    setDiscusses(
      produce((draft) => {
        draft.push(data);
      }),
    );
  });

  const updateDiscuss = useMemoizedFn(
    (id: number, data: API.UpdationDiscuss) => {
      setDiscusses(
        produce((draft) => {
          const target = draft.find((item) => item.id === selectedDiscussId);
          if (target) {
            Object.assign(target, data);
          }
        }),
      );
    },
  );

  const updateSelectedDiscussContent = useMemoizedFn(
    (data: Partial<Discuss>) => {
      setDiscusses(
        produce((draft) => {
          const target = draft.find((item) => item.id === selectedDiscussId);
          if (target) {
            Object.assign(target, data);
          }
        }),
      );
    },
  );

  const selectedNextItem = useMemo(() => {
    if (selectedItemIndex !== undefined) {
      const next = filterDiscusses[selectedItemIndex + 1];
      return next;
    }
    return undefined;
  }, [selectedItemIndex, filterDiscusses]);

  const { run: requestCreateDiscuss, loading: requestCreateDiscussLoading } =
    useRequest(
      async (
        params: API.CreationDiscuss,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        opts?: {
          onSuccess?: (data: API.ShownDiscuss | undefined) => void;
        },
      ) => {
        return DiscussControllerCreate(params);
      },
      {
        manual: true,
        onSuccess: (data, params) => {
          params[1]?.onSuccess?.(data);
          /** 创建成功后，替换 temp */
          if (data) {
            setTempDiscuss(undefined);
            setSelectedDiscussId(data.id);
            addDiscuss(data);
          }
        },
      },
    );

  const { run: requestUpdateDiscuss, loading: requestUpdateDiscussLoading } =
    useRequest(
      async (
        id: number,
        data: API.UpdationDiscuss,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSuccess?: (data: API.ShownDiscuss | undefined) => void,
      ) => {
        return DiscussControllerUpdate(
          {
            id,
          },
          data,
        );
      },
      {
        manual: true,
        onSuccess: (data, params) => {
          params[2]?.(data);
          // 注意 update effect 和 update request 不要相互冲突
          // if (data) {
          //   updateDiscuss(data.id, data);
          // }
        },
      },
    );

  const {
    run: requestResolvedDiscuss,
    loading: requestResolvedDiscussLoading,
  } = useRequest(
    async (
      id: number,
      data: {
        resolved: boolean;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSuccess?: (data: API.ShownDiscuss | undefined) => void,
    ) => {
      return DiscussControllerUpdate(
        {
          id,
        },
        data,
      );
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        params[2]?.(data);
        if (data) {
          updateDiscuss(data.id, data);
        }
      },
    },
  );

  const { run: requestDeleteDiscuss, loading: requestDeleteDiscussLoading } =
    useRequest(
      async (
        id: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSuccess?: (data: API.ShownDiscuss | undefined) => void,
      ) => {
        return DiscussControllerDestroy({
          id,
        });
      },
      {
        manual: true,
        onSuccess: (data, params) => {
          params[1]?.(data);
          deleteDiscuss(params[0]);
          setSelectedDiscussId(undefined);
          setDetailMode('list');
        },
      },
    );

  useRequest(
    async () => {
      const pageId = getPageIdOrThrow();
      return DiscussControllerIndex({
        pageId,
      });
    },
    {
      onSuccess: (data) => {
        if (data) {
          setDiscusses(data);
        }
      },
    },
  );

  useUpdateEffect(() => {
    if (selectedDiscussId) {
      setDetailVisible(true);
    }
  }, [selectedDiscussId]);

  useUpdateEffect(() => {
    if (tempDiscuss) {
      setDetailVisible(false);
    }
  }, [tempDiscuss]);

  /** 当选中数据变化，同步后端接口 */
  useUpdateEffect(() => {
    if (selectedDiscuss) {
      const { id, ...rest } = selectedDiscuss;
      requestUpdateDiscuss(id, rest);
    }
  }, [selectedDiscuss]);

  /** 当 选中 item 变化的时候，相应清除 index */
  useUpdateEffect(() => {
    if (!selectedDiscussId) {
      setSelectedItemIndex(undefined);
    } else {
      const index = filterDiscussesRef.current.findIndex(
        (item) => item.id === selectedDiscussId,
      );
      setSelectedItemIndex(index);
    }
  }, [selectedDiscussId]);

  return {
    mode,
    discusses,
    detailVisible,
    requestCreateDiscussLoading,
    selectedDiscussId,
    tempDiscuss,
    selectedDiscuss,
    requestUpdateDiscussLoading,
    requestResolvedDiscuss,
    requestResolvedDiscussLoading,
    requestDeleteDiscussLoading,
    selectedDiscussRef,
    detailMode,
    detailListFilterMode,
    filterDiscusses,
    selectedItemIndex,
    selectedNextItem,
    setSelectedItemIndex,
    setDetailListFilterMode,
    setDetailMode,
    updateDiscuss,
    requestDeleteDiscuss,
    deleteDiscuss,
    getSelectedDiscussId,
    setMode,
    addDiscuss,
    requestCreateDiscuss,
    setSelectedDiscussId,
    setTempDiscuss,
    setDetailVisible,
    updateSelectedDiscussContent,
    requestUpdateDiscuss,
  };
};

export default usePlayground;
