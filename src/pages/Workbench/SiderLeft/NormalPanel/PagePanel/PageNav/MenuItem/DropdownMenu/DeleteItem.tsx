import { PageControllerDestroy } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';

export default ({ item }: { item: API.ShownPage }) => {
  const { deletePath } = useModel('page.pageList', (model) => ({
    deletePath: model.deletePath,
  }));

  const { run: runDelete, loading: deleteLoading } = useRequest(
    async () => {
      return PageControllerDestroy({
        id: item.id,
      });
    },
    {
      manual: true,
      onSuccess: (page) => {
        deletePath(page);
      },
      loadingDelay: 300,
    },
  );

  return (
    <Spin spinning={deleteLoading}>
      <div onClick={() => runDelete()}>删除</div>
    </Spin>
  );
};
