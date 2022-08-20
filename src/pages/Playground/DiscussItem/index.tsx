import { DiscussTag } from '@/components/DiscussTag';
import { useModel } from '@umijs/max';
import { memo } from 'react';

const DiscussItem = (props: API.Discuss) => {
  const { setSelectedDiscussId, selectedDiscussId } = useModel(
    'playground',
    (model) => ({
      setSelectedDiscussId: model.setSelectedDiscussId,
      selectedDiscussId: model.selectedDiscussId,
    }),
  );

  return (
    <DiscussTag
      className="discussItem"
      type={selectedDiscussId === props.id ? 'primary' : 'default'}
      onClick={(event) => {
        /** 防止重复创建 temp */
        event.stopPropagation();
        setSelectedDiscussId(props.id);
      }}
      top={props.top}
      left={props.left}
    />
  );
};

export default memo(DiscussItem);
