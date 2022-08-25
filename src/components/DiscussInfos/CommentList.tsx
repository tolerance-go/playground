import { NestDiscussComment } from '@/models/discussComments';
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import {
  Avatar,
  Button,
  Comment,
  Input,
  List,
  Popconfirm,
  Tooltip,
} from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
const { TextArea } = Input;

const Editor = ({
  onChange,
  onSubmit,
  submitting,
  value,
  label = '添加评论',
  autoFocus,
}: {
  onChange: TextAreaProps['onChange'];
  onSubmit: () => void;
  submitting: boolean;
  value: string;
  label?: string;
  autoFocus?: boolean;
}) => (
  <>
    <TextArea
      autoFocus={autoFocus}
      rows={3}
      onChange={onChange}
      value={value}
      style={{
        marginBottom: 10,
      }}
    />
    <Button
      htmlType="submit"
      loading={submitting}
      onClick={onSubmit}
      type="primary"
    >
      {label}
    </Button>
  </>
);

const ReplyItem = (props: {
  commentId: number;
  onReplaySuccess: () => void;
}) => {
  const { requestCreateDiscussComments, requestCreateDiscussCommentsLoading } =
    useModel('discuss.discussComments', (model) => ({
      requestCreateDiscussComments: model.requestCreateDiscussComments,
      requestCreateDiscussCommentsLoading:
        model.requestCreateDiscussCommentsLoading,
    }));

  const { getSelectedDiscussId } = useModel('playground', (model) => ({
    getSelectedDiscussId: model.getSelectedDiscussId,
  }));

  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;
    const discussId = getSelectedDiscussId();
    if (discussId) {
      requestCreateDiscussComments(
        {
          content: value,
          discussId,
          replyTo: props.commentId,
        },
        {
          onSuccess: () => {
            setValue('');
            props.onReplaySuccess();
          },
        },
      );
    }
  };

  return (
    <Comment
      avatar={
        <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      }
      content={
        <Editor
          autoFocus
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onSubmit={handleSubmit}
          submitting={requestCreateDiscussCommentsLoading}
          value={value}
          label="添加回复"
        />
      }
    />
  );
};

const CommnetItem = (props: NestDiscussComment) => {
  const {
    requestUpdateDiscussComments,
    replyingCommentId,
    setReplyingCommentId,
    requestDeleteDiscussComments,
  } = useModel('discuss.discussComments', (model) => ({
    requestUpdateDiscussComments: model.requestUpdateDiscussComments,
    requestDeleteDiscussComments: model.requestDeleteDiscussComments,
    replyingCommentId: model.replyingCommentId,
    setReplyingCommentId: model.setReplyingCommentId,
  }));

  const [likeNum, setLikeNum] = useState(props.likeNum ?? 0);
  const [dislikeNum, setDislikeNum] = useState(props.dislikeNum ?? 0);
  const [action, setAction] = useState<'liked' | 'disliked' | null>(null);

  const like = () => {
    setLikeNum((prev) => prev + 1);
    if (action === 'disliked') {
      setDislikeNum((prev) => prev - 1);
    }
    setAction('liked');
  };

  const dislike = () => {
    setDislikeNum((prev) => prev + 1);
    if (action === 'liked') {
      setLikeNum((prev) => prev - 1);
    }
    setAction('disliked');
  };

  useUpdateEffect(() => {
    requestUpdateDiscussComments(props.id, {
      likeNum: likeNum,
      dislikeNum: dislikeNum,
    });
  }, [likeNum, dislikeNum]);

  const actions = [
    <Tooltip key="comment-basic-like" title="点赞">
      <span onClick={like}>
        {React.createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
        <span
          style={{
            paddingLeft: 5,
          }}
        >
          {likeNum}
        </span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="点踩">
      <span onClick={dislike}>
        {React.createElement(
          action === 'disliked' ? DislikeFilled : DislikeOutlined,
        )}
        <span
          style={{
            paddingLeft: 5,
          }}
        >
          {dislikeNum}
        </span>
      </span>
    </Tooltip>,
    <span
      key="comment-basic-reply-to"
      onClick={() => {
        setReplyingCommentId(props.id);
      }}
    >
      回复
    </span>,
    <Popconfirm
      key="comment-basic-remove-to"
      title="删除评论后，评论下所有回复都会被删除是否继续?"
      onConfirm={() => {
        requestDeleteDiscussComments(props.id);
      }}
      okText="是"
      cancelText="否"
    >
      <span>删除</span>
    </Popconfirm>,
  ];

  return (
    <Comment
      author={'admin'}
      datetime={dayjs(props.createdAt).fromNow()}
      avatar={
        <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      }
      actions={actions}
      content={
        replyingCommentId === props.id ? (
          <div>
            {props.content}
            <ReplyItem
              commentId={props.id}
              onReplaySuccess={() => {
                setReplyingCommentId(undefined);
              }}
            />
          </div>
        ) : (
          props.content
        )
      }
    >
      {props.replyComments?.map((item) => {
        return <CommnetItem key={item.id} {...item} />;
      })}
    </Comment>
  );
};

const CommentList = ({ comments }: { comments: API.ShownComment[] }) => (
  <List<API.ShownComment>
    dataSource={comments}
    itemLayout="horizontal"
    renderItem={(props) => <CommnetItem {...props} />}
  />
);

const App = (props: { discussId: number }) => {
  const {
    nestDiscussComments,
    requestIndexDiscussComments,
    requestCreateDiscussComments,
    requestCreateDiscussCommentsLoading,
  } = useModel('discuss.discussComments', (model) => ({
    requestIndexDiscussComments: model.requestIndexDiscussComments,
    requestCreateDiscussComments: model.requestCreateDiscussComments,
    requestCreateDiscussCommentsLoading:
      model.requestCreateDiscussCommentsLoading,
    nestDiscussComments: model.nestDiscussComments,
  }));

  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;
    requestCreateDiscussComments(
      {
        content: value,
        discussId: props.discussId,
      },
      {
        onSuccess: () => {
          setValue('');
        },
      },
    );
  };

  useEffect(() => {
    requestIndexDiscussComments(props.discussId);
  }, []);

  return (
    <>
      {nestDiscussComments.length > 0 && (
        <CommentList comments={nestDiscussComments} />
      )}
      <Comment
        avatar={
          <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
        }
        content={
          <Editor
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onSubmit={handleSubmit}
            submitting={requestCreateDiscussCommentsLoading}
            value={value}
          />
        }
      />
    </>
  );
};

export default App;
