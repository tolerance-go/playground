import {
  CommentControllerCreate,
  CommentControllerDestroyEvery,
  CommentControllerIndex,
  CommentControllerUpdate,
} from '@/services/server/CommentController';
import { findTreeNode } from '@/utils/treeUtils/findTreeNode';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { produce } from 'immer';
import { useMemo, useState } from 'react';

export type NestDiscussComment = API.ShownComment & {
  replyComments?: NestDiscussComment[];
};

/**
 * 当前讨论下的评论，不是所有的评论
 */
const useDiscussComments = () => {
  const [discussComments, setDiscussComments] = useState<API.ShownComment[]>(
    [],
  );

  const [replyingCommentId, setReplyingCommentId] = useState<number>();

  const { increaseDiscussCommentsCount, reduceDiscussCommentsCount } = useModel(
    'discuss.allDiscussCommentsCount',
    (model) => ({
      increaseDiscussCommentsCount: model.increaseDiscussCommentsCount,
      reduceDiscussCommentsCount: model.reduceDiscussCommentsCount,
    }),
  );

  const { getSelectedDiscussId } = useModel('playground', (model) => ({
    getSelectedDiscussId: model.getSelectedDiscussId,
  }));

  const nestDiscussComments = useMemo(() => {
    const topLevel = discussComments.filter((item) => !item.replyTo);
    const replied = discussComments.filter((item) => item.replyTo);

    const findAndRemoveReplyTarget = (
      items: NestDiscussComment[],
      target: NestDiscussComment,
    ) => {
      if (items.length === 0) {
        return [];
      }

      const next = [...items];
      const back: NestDiscussComment[] = [];

      next.forEach((item) => {
        if (item.replyTo === target.id) {
          back.push(item);
          const index = items.findIndex((it) => it.id === item.id);
          items.splice(index, 1);
        }
      });

      return back;
    };

    const injectReplyComments = (
      items: NestDiscussComment[],
    ): NestDiscussComment[] => {
      return items.map((item) => {
        const replyComments = findAndRemoveReplyTarget(replied, item);

        return {
          ...item,
          replyComments: injectReplyComments(replyComments),
        };
      });
    };

    return injectReplyComments(topLevel);
  }, [discussComments]);

  const {
    run: requestIndexDiscussComments,
    loading: requestIndexDiscussCommentsLoading,
  } = useRequest(
    async (discussId: number) => {
      return CommentControllerIndex({
        discussId,
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          setDiscussComments(data);
        }
      },
    },
  );

  const {
    run: requestCreateDiscussComments,
    loading: requestCreateDiscussCommentsLoading,
  } = useRequest(
    async (
      data: API.CreationComment,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      opts?: {
        onSuccess?: (data: API.ShownComment | undefined) => void;
      },
    ) => {
      return CommentControllerCreate(data);
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        params[1]?.onSuccess?.(data);
        if (data) {
          setDiscussComments((prev) => prev.concat(data));
        }

        increaseDiscussCommentsCount(getSelectedDiscussId()!);
      },
    },
  );

  const {
    run: requestUpdateDiscussComments,
    loading: requestUpdateDiscussCommentsLoading,
  } = useRequest(
    async (id: number, data: API.UpdationComment) => {
      return CommentControllerUpdate(
        {
          id,
        },
        data,
      );
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          setDiscussComments(
            produce((draft) => {
              const index = draft.findIndex((item) => item.id === data.id);
              if (index > -1) {
                draft[index] = data;
              }
            }),
          );
        }
      },
    },
  );

  /** 删除评论并且将子集评论都删除 */
  const {
    run: requestDeleteDiscussComments,
    loading: requestDeleteDiscussCommentsLoading,
  } = useRequest(
    async (id: number) => {
      const findAllReplyToTargetComments = (
        targets: NestDiscussComment[],
        arr: number[] = [],
      ) => {
        arr.push(...targets.map((item) => item.id));

        targets.forEach((target) => {
          if (target?.replyComments) {
            findAllReplyToTargetComments(target.replyComments, arr);
          }
        });

        return arr;
      };

      const target = findTreeNode(
        nestDiscussComments,
        (item) => item.id === id,
        'replyComments',
      );

      return CommentControllerDestroyEvery(
        findAllReplyToTargetComments([target!]),
      );
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          setDiscussComments(
            produce((draft) => {
              data.forEach((item) => {
                const index = draft.findIndex((it) => it.id === item.id);
                if (index > -1) {
                  draft.splice(index, 1);
                }
              });
            }),
          );
          reduceDiscussCommentsCount(getSelectedDiscussId()!, data.length);
        }
      },
    },
  );

  return {
    nestDiscussComments,
    requestCreateDiscussComments,
    requestCreateDiscussCommentsLoading,
    discussComments,
    requestIndexDiscussComments,
    requestIndexDiscussCommentsLoading,
    requestUpdateDiscussComments,
    requestUpdateDiscussCommentsLoading,
    replyingCommentId,
    setReplyingCommentId,
    requestDeleteDiscussComments,
    requestDeleteDiscussCommentsLoading,
  };
};

export default useDiscussComments;
