import { DiscussControllerCreate } from '@/services/server/DiscussController';
import { useRequest } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { useState } from 'react';

export type PlaygroundMode = 'cursor' | 'discuss';

export type Discuss = {
  id: number;
  title: string;
  desc?: string;
  belongsToComId: number;
  belongsToComStatId: number;
  left: number;
  top: number;
  /** 创建时候所属组件的长宽，用来后期动态算比例 */
  containerWidth: number;
  containerHeight: number;
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

  const addDiscuss = useMemoizedFn((data: Discuss) => {
    setDiscusses(
      produce((draft) => {
        draft.push(data);
      }),
    );
  });

  const { run: requestCreateDiscuss, loading: requestCreateDiscussLoading } =
    useRequest(
      async (params: API.CreationDiscuss) => {
        return DiscussControllerCreate(params);
      },
      {
        manual: true,
        onSuccess: (data) => {
          if (data) {
            addDiscuss(data);
          }
        },
      },
    );

  return {
    mode,
    discusses,
    setMode,
    addDiscuss,
    requestCreateDiscuss,
    requestCreateDiscussLoading,
  };
};

export default usePlayground;
