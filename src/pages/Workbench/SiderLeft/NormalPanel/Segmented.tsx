import { NormalStatus } from '@/models/siderLeft/normalModeSubMode';
import { useModel } from '@umijs/max';
import { Segmented } from 'antd';

export default () => {
  const { normalStatus, setNormalStatus } = useModel(
    'siderLeft.normalModeSubMode',
    (model) => ({
      normalStatus: model.normalStatus,
      setNormalStatus: model.setNormalStatus,
    }),
  );

  return (
    <Segmented
      onChange={(val) => setNormalStatus(val as NormalStatus)}
      value={normalStatus}
      block
      options={[
        {
          label: '页面',
          value: 'page',
        },
        {
          label: '布局',
          value: 'layout',
        },
        {
          label: '物料',
          value: 'material',
        },
      ]}
    />
  );
};
