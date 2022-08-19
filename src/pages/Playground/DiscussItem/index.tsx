import { useModel } from '@umijs/max';
import { memo } from 'react';
import { DiscussTag } from '../DiscussTag';

const DiscussItem = (props: { id: number }) => {
  const { discuss } = useModel('playground', (model) => {
    return {
      discuss: model.discusses[props.id],
    };
  });

  return <DiscussTag top={discuss.top} left={discuss.left} />;
};

export default memo(DiscussItem);
