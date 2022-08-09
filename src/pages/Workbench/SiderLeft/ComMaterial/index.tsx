import { ComponentControllerIndex } from '@/services/server/ComponentController';
import { ProList } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import qs from 'qs';
import styles from './index.less';
import MaterialCreator from './MaterialCreator';

export default () => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const { appId } = query;
  const { comsMaterials, setComsMaterials } = useModel(
    'comsMaterialList',
    (model) => ({
      comsMaterials: model.comsMaterialList,
      setComsMaterials: model.setComsMaterialList,
    }),
  );

  const { setComActiveMaterialId, comActiveMaterialId } = useModel(
    'comActiveMaterialId',
    (model) => {
      return {
        setComActiveMaterialId: model.setComActiveMaterialId,
        comActiveMaterialId: model.comActiveMaterialId,
      };
    },
  );

  const { loading } = useRequest(
    async () => {
      return await ComponentControllerIndex({
        appId: Number(appId),
      });
    },
    {
      onSuccess: (data) => {
        setComsMaterials(data);
      },
    },
  );

  return (
    <ProList<API.Component>
      className={styles.list}
      style={{
        marginTop: 10,
      }}
      split
      loading={loading}
      rowKey="id"
      dataSource={comsMaterials}
      showActions="hover"
      onRow={(record) => {
        return {
          className:
            record.id === comActiveMaterialId ? styles.active : undefined,
        };
      }}
      metas={{
        title: {
          dataIndex: 'name',
        },
        description: {
          dataIndex: 'desc',
        },
        actions: {
          render: (dom, entity) => {
            return [
              <a
                key="apply"
                onClick={() => {
                  setComActiveMaterialId(entity.id);
                }}
              >
                应用
              </a>,
            ];
          },
        },
      }}
      headerTitle={'暂存组件'}
      toolBarRender={() => [<MaterialCreator key={'0'} />]}
    />
  );
};
