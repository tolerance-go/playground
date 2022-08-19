import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Comment, Input, List, Tooltip } from 'antd';
import moment from 'dayjs';
import React, { useState } from 'react';
const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <TextArea
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
      添加评论
    </Button>
  </>
);

const CommnetIItem = (props) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState<string | null>(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction('liked');
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction('disliked');
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {React.createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
        <span
          className="comment-action"
          style={{
            paddingLeft: 5,
          }}
        >
          {likes}
        </span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(
          action === 'disliked' ? DislikeFilled : DislikeOutlined,
        )}
        <span
          className="comment-action"
          style={{
            paddingLeft: 5,
          }}
        >
          {dislikes}
        </span>
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to">回复</span>,
  ];

  return (
    <Comment
      {...props}
      actions={props.id === '111' ? undefined : actions}
      content={
        props.id === '111' ? (
          <div>
            {props.content}
            <Comment
              avatar={
                <Avatar
                  src="https://joeschmoe.io/api/v1/random"
                  alt="Han Solo"
                />
              }
              content={<Editor />}
            />
          </div>
        ) : (
          props.content
        )
      }
    />
  );
};

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={(props) => <CommnetIItem {...props} />}
  />
);

const App = () => {
  const [comments, setComments] = useState([
    {
      id: '111',
      author: 'Han Solo',
      avatar: 'https://joeschmoe.io/api/v1/random',
      content: <p>aslfjalsdfjlasjdflasjdflajsdflj</p>,
      datetime: moment().fromNow(),
    },
    {
      author: 'Han Solo',
      avatar: 'https://joeschmoe.io/api/v1/random',
      content: <p>aslfjalsdfjlasjdflasjdflajsdflj</p>,
      datetime: moment().fromNow(),
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: 'Han Solo',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content: <p>{value}</p>,
          datetime: moment().fromNow(),
        },
      ]);
    }, 1000);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={
          <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
};

export default App;
