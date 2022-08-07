import { UnsyncFields } from '@/models/statusRelations';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Space } from 'antd';

export const FormItemExtendLabel = ({
  label,
  fieldName,
  lockFields,
  onUnLockClick,
  onLockClick,
}: {
  label: string;
  fieldName: string;
  lockFields: UnsyncFields | undefined;
  onUnLockClick: () => void;
  onLockClick: () => void;
}) => {
  return (
    <Space>
      {label}
      {lockFields?.[fieldName] ? (
        /**
         * 锁住表示不自动同步，那么用户就是可以自定义输入的
         * 这里和界面的图标是相反的
         */
        <UnlockOutlined onClick={onUnLockClick} />
      ) : (
        <LockOutlined onClick={onLockClick} />
      )}
    </Space>
  );
};
