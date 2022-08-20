import { DiscussTag } from '@/components/DiscussTag';
import { useModel } from '@umijs/max';

export const TempDiscussItem = () => {
  const { tempDiscuss } = useModel('playground', (model) => ({
    tempDiscuss: model.tempDiscuss,
  }));

  return tempDiscuss ? (
    <DiscussTag
      type={tempDiscuss.createdSuccess ? 'default' : 'dashed'}
      top={tempDiscuss.top}
      left={tempDiscuss.left}
    />
  ) : null;
};
