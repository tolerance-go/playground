import {
  DiscussControllerCreate,
  DiscussControllerIndex,
  DiscussControllerUpdate,
} from '@/services/server/DiscussController';
import { useRequest } from '@umijs/max';
import { useGetState, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { produce } from 'immer';
import { useMemo, useState } from 'react';
import { getURLQuery } from './../helps/getURLQuery';

export type PlaygroundMode = 'cursor' | 'discuss';

export type Discuss = API.Discuss;

export type TempDiscuss = Omit<Discuss, 'id'> & {
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

  const [detailVisible, setDetailVisible] = useState(false);

  const selectedDiscuss = useMemo(() => {
    return discusses.find((item) => item.id === selectedDiscussId);
  }, [discusses, selectedDiscussId]);

  const addDiscuss = useMemoizedFn((data: Discuss) => {
    setDiscusses(
      produce((draft) => {
        draft.push(data);
      }),
    );
  });

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
        data: API.CreationDiscuss,
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

          // if (data) {
          //   setTempTitleEditing(false);
          //   setTempDiscuss({
          //     ...data,
          //     createdSuccess: true,
          //   });
          // }
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
    if (tempDiscuss) {
      setDetailVisible(true);
    }
  }, [tempDiscuss]);

  useUpdateEffect(() => {
    if (detailVisible) {
      if (getTempDiscuss()) {
        /** 目标是让打开后，标题自动聚焦，这里依赖 antd 组件内部实现 */
        setTimeout(() => {
          setTempTitleEditing(true);
        });
      }
    }
  }, [detailVisible]);

  /** 关闭讨论详情的时候，如果当前存在 temp，需要清空 */
  useUpdateEffect(() => {
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
  }, [detailVisible]);

  /** 关闭抽屉的时候，如果存在 selectedDiscussId 需要清空 */
  useUpdateEffect(() => {
    if (detailVisible === false) {
      if (getSelectedDiscussId()) {
        setSelectedDiscussId(undefined);
      }
    }
  }, [detailVisible]);

  /** 选中后，联动打开详情 */
  useUpdateEffect(() => {
    if (selectedDiscussId) {
      setDetailVisible(true);
    }
  }, [selectedDiscussId]);

  /** 当选中数据变化，同步后端接口 */
  useUpdateEffect(() => {
    if (selectedDiscuss) {
      const { id, ...rest } = selectedDiscuss;
      requestUpdateDiscuss(id, rest);
    }
  }, [selectedDiscuss]);

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
