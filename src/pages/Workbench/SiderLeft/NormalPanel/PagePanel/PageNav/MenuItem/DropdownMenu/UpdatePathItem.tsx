import { useModel } from '@umijs/max';

export default ({ item }: { item: API.ShownPage }) => {
  const { selectPageToUpdating } = useModel(
    'page.pageUpdatingMeta',
    (model) => ({
      selectPageToUpdating: model.selectPageToUpdating,
    }),
  );

  return <div onClick={() => selectPageToUpdating(item.id)}>修改路径</div>;
};
