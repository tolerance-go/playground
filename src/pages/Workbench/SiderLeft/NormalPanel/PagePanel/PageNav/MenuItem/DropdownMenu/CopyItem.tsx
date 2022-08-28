import { useModel } from '@umijs/max';

export default ({ item }: { item: API.ShownPage }) => {
  const { setTempInputValueByTarget } = useModel(
    'page.pageCreatingMeta',
    (model) => ({
      setTempInputValueByTarget: model.setTempInputValueByTarget,
    }),
  );

  return <div onClick={() => setTempInputValueByTarget(item)}>复制</div>;
};
