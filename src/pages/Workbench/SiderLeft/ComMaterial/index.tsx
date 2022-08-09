import { ComMaterial } from '@/models/comsMaterialList';
import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import MaterialCreator from './MaterialCreator';

export default () => {
  const { comsMaterials } = useModel('comsMaterialList', (model) => ({
    comsMaterials: model.comsMaterials,
  }));

  const { setComActiveMaterialId } = useModel(
    'comActiveMaterialId',
    (model) => {
      return {
        setComActiveMaterialId: model.setComActiveMaterialId,
      };
    },
  );

  return (
    <ProList<ComMaterial>
      className={styles.list}
      style={{
        marginTop: 10,
      }}
      split
      rowKey="id"
      dataSource={comsMaterials}
      showActions="hover"
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
