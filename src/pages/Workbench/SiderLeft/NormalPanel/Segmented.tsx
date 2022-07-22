import { NormalStatus } from '@/models/siderLeftMode';
import { useModel } from '@umijs/max';
import { Segmented } from 'antd';

export default () => {
  const { normalStatus, setNormalStatus } = useModel(
    'siderLeftMode',
    (model) => ({
      setNormalStatus: model?.setNormalStatus,
      normalStatus: model?.normalStatus,
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
          label: '资源',
          value: 'asset',
        },
      ]}
    />
  );
};
