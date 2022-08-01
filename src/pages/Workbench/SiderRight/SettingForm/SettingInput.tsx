import { SegmentedSwitch } from '@/components/SegmentedSwitch';
import { ComStatRelation } from '@/models/statusRelations';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { Input, Select } from 'antd';

export const SettingInput = ({
  config,
  value,
  onChange,
  extendRelation,
  fieldName,
}: {
  config: SettingFormConfig[number];
  value?: any;
  onChange?: (next: any) => void;
  fieldName: string;
  extendRelation: ComStatRelation | undefined;
}) => {
  const disabled = extendRelation
    ? /**
       * 锁住表示不自动同步，那么用户就是可以自定义输入的
       * 这里和界面的图标是相反的
       */
      !extendRelation.lockFields[fieldName]
    : false;

  if (config.type === 'string') {
    return (
      <Input
        disabled={disabled}
        bordered={false}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (config.type === 'select') {
    return (
      <Select
        disabled={disabled}
        mode={config.multiple ? 'multiple' : undefined}
        value={value}
        onChange={onChange}
        options={config.options}
        bordered={false}
      />
    );
  }

  if (config.type === 'boolean') {
    return (
      <SegmentedSwitch disabled={disabled} value={value} onChange={onChange} />
    );
  }

  return null;
};
