import {
  DiscussControllerCreate,
  DiscussControllerDestroy,
  DiscussControllerIndex,
  DiscussControllerUpdate,
} from '@/services/server/DiscussController';
import { useRequest } from '@umijs/max';
import { useGetState, useLatest, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { produce } from 'immer';
import { useMemo, useState } from 'react';
import { getURLQuery } from './../helps/getURLQuery';

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

const usePlayground = () => {
  const [mode, setMode] = useState<PlaygroundMode>('cursor');
  const [discusses, setDiscusses] = useState<Discuss[]>([]);
  const [selectedDiscussId, setSelectedDiscussId, getSelectedDiscussId] =
    useGetState<number>();

  /** 临时创建的讨论 */
  const [tempDiscuss, setTempDiscuss, getTempDiscuss] =
    useGetState<TempDiscuss>();

  const [tempTitleEditing, setTempTitleEditing, getTempTitleEditing] =
    useGetState(false);

  const [detailVisible, setDetailVisible, getDetailVisible] =
    useGetState(false);

  const [detailMode, setDetailMode] = useState<'list' | 'detail'>('detail');
  const [detailListFilterMode, setDetailListFilterMode] = useState<
    'resolved' | 'open'
  >('open');

  /** 选中 item 所在 filterItems 的下标 */
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>();

  const detailModeRef = useLatest(detailMode);

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
    (data: Pick<Discuss, 'desc' | 'title'>) => {
      setDiscusses(
        produce((draft) => {
          const target = draft.find((item) => item.id === selectedDiscussId);
          if (target) {
            target.desc = data.desc;
            target.title = data.title;
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
      async (params: API.CreationDiscuss) => {
        return DiscussControllerCreate(params);
      },
      {
        manual: true,
        onSuccess: (data) => {
          /** 创建成功后，替换 temp */
          if (data) {
            setTempTitleEditing(false);
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
          if (data) {
            updateDiscuss(data.id, data);
          }
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
        },
      },
    );

  useRequest(
    async () => {
      const query = getURLQuery();
      return DiscussControllerIndex({
        pageId: Number(query.pageId),
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

  /** 创建 temp 的时候，需要同时打开讨论详情 */
  useUpdateEffect(() => {
    if (detailModeRef.current === 'detail') {
      if (tempDiscuss && getDetailVisible() === false) {
        setDetailVisible(true);
      }
    }
  }, [tempDiscuss]);

  /**
   * tempDiscuss 为空时候，关闭 detail
   * 注意：temp 创建成功后，应该关闭窗口，但是后面有个 selectedId 打开的逻辑，相互抵消了
   */
  useUpdateEffect(() => {
    if (detailModeRef.current === 'detail') {
      if (!tempDiscuss && getDetailVisible() === true) {
        setDetailVisible(false);
      }
    }
  }, [tempDiscuss]);

  useUpdateEffect(() => {
    if (detailModeRef.current === 'detail') {
      if (detailVisible) {
        if (getTempDiscuss()) {
          /** 目标是让打开后，标题自动聚焦，这里依赖 antd 组件内部实现 */
          setTimeout(() => {
            setTempTitleEditing(true);
          });
        }
      }
    }
  }, [detailVisible]);

  /** 关闭讨论详情的时候，如果当前存在 temp，需要清空 */
  useUpdateEffect(() => {
    if (detailModeRef.current === 'detail') {
      if (detailVisible === false) {
        if (getTempTitleEditing()) {
          /** 目标是关闭抽屉动画结束后，再执行切换动画 */
          setTimeout(() => {
            setTempTitleEditing(false);
          }, 200);
        }
        if (getTempDiscuss()) {
          setTempDiscuss(undefined);
        }
      }
    }
  }, [detailVisible]);

  /** 关闭抽屉的时候，如果存在 selectedDiscussId 需要清空 */
  useUpdateEffect(() => {
    if (detailModeRef.current === 'detail') {
      if (detailVisible === false) {
        if (getSelectedDiscussId()) {
          setSelectedDiscussId(undefined);
        }
      }
    }
  }, [detailVisible]);

  /** 选中后，联动打开详情 */
  useUpdateEffect(() => {
    if (detailModeRef.current === 'detail') {
      if (selectedDiscussId) {
        setDetailVisible(true);
      } else {
        if (getDetailVisible()) {
          setDetailMode('list');
        }
      }
    }
  }, [selectedDiscussId]);

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
    tempTitleEditing,
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
    getTempTitleEditing,
    getSelectedDiscussId,
    setTempTitleEditing,
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
