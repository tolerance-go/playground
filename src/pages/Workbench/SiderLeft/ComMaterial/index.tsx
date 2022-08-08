import { ComMaterial } from '@/models/comsMaterials';
import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import MaterialCreator from './MaterialCreator';

export default () => {
  const { comsMaterials } = useModel('comsMaterials', (model) => ({
    comsMaterials: model.comsMaterials,
  }));

  return (
    <ProList<ComMaterial>
      className={styles.list}
      style={{
        marginTop: 10,
      }}
      split
      rowKey="id"
      dataSource={Object.keys(comsMaterials ?? {}).map((actionId) => {
        const action = comsMaterials[actionId];
        return action;
      })}
      showActions="hover"
      metas={{
        title: {
          dataIndex: 'name',
        },
        description: {
          dataIndex: 'desc',
        },
      }}
      headerTitle={'暂存组件'}
      toolBarRender={() => [<MaterialCreator key={'0'} />]}
    />
  );
};
