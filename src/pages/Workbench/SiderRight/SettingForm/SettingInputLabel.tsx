import { ComStatRelation } from '@/models/statusRelations';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Space } from 'antd';

export const SettingInputLabel = ({
  extendRelation,
  label,
  fieldName,
  comId,
}: {
  comId: string;
  label: string;
  fieldName: string;
  extendRelation: ComStatRelation | undefined;
}) => {
  const { lockComExtendField, unlockComExtendField } = useModel(
    'statusRelations',
    (model) => ({
      lockComExtendField: model.lockComExtendField,
      unlockComExtendField: model.unlockComExtendField,
    }),
  );

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  if (!extendRelation) {
    return <span>{label}</span>;
  }

  return (
    <Space>
      {label}
      {extendRelation.lockFields[fieldName] ? (
        /**
         * 锁住表示不自动同步，那么用户就是可以自定义输入的
         * 这里和界面的图标是相反的
         */
        <UnlockOutlined
          onClick={() => {
            unlockComExtendField(comId, extendRelation.id, fieldName);
            triggerPrepareSaveTimeChange();
          }}
        />
      ) : (
        <LockOutlined
          onClick={() => {
            lockComExtendField(comId, extendRelation.id, fieldName);
            triggerPrepareSaveTimeChange();
          }}
        />
      )}
    </Space>
  );
};
