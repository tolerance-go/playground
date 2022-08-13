import { ComponentControllerDestroy } from '@/services/server/ComponentController';
import { ProList } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Spin } from 'antd';
import styles from './index.less';
import MaterialCreator from './MaterialCreator';

export default () => {
  const { comsMaterials, comsMaterialListLoading, removeComMaterial } =
    useModel('comsMaterialList', (model) => ({
      comsMaterials: model.comsMaterialList,
      comsMaterialListLoading: model.comsMaterialListLoading,
      removeComMaterial: model.removeComMaterial,
    }));

  const { setComActiveMaterialId, comActiveMaterialId } = useModel(
    'comActiveMaterialId',
    (model) => {
      return {
        setComActiveMaterialId: model.setComActiveMaterialId,
        comActiveMaterialId: model.comActiveMaterialId,
      };
    },
  );

  const { loading: removeLoading, run } = useRequest(
    async (id: API.Component['id']) => {
      return await ComponentControllerDestroy({
        id: String(id),
      });
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (data?.id) {
          removeComMaterial(data?.id);
        }
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
      loading={comsMaterialListLoading}
      rowKey="id"
      dataSource={comsMaterials}
      showActions="hover"
      onRow={(record) => {
        return {
          className:
            record.id === comActiveMaterialId ? styles.active : undefined,
          onClick: () => {
            setComActiveMaterialId(record.id);
          },
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
              <Spin key="remove" spinning={removeLoading}>
                <a
                  onClick={() => {
                    run(entity.id);
                  }}
                >
                  删除
                </a>
              </Spin>,
            ];
          },
        },
      }}
      headerTitle={'暂存组件'}
      toolBarRender={() => [<MaterialCreator key={'0'} />]}
    />
  );
};
