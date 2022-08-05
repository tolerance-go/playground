import { SegmentedSwitch } from '@/components/SegmentedSwitch';
import { useSelectedComponentStatus } from '@/hooks/useSelectedComponentStatus';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { Input, Select } from 'antd';
import BoxSizeInput from '../BoxSizeInput';

export type ConfigInputProps = {
  disabled?: boolean;
  config: SettingFormConfig[number];
  value?: any;
  onChange?: (next: any) => void;
  bordered?: boolean;
};

export const ConfigInput = ({
  config,
  value,
  onChange,
  disabled,
  bordered,
}: ConfigInputProps) => {
  const { getSelectedComStatus } = useSelectedComponentStatus();

  if (config.type === 'string') {
    return (
      <Input
        disabled={disabled}
        bordered={bordered}
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
        options={
          typeof config.options === 'function'
            ? config.options({
                getSelectedComStatus,
              })
            : config.options
        }
        bordered={bordered}
      />
    );
  }

  if (config.type === 'boolean') {
    return (
      <SegmentedSwitch disabled={disabled} value={value} onChange={onChange} />
    );
  }

  if (config.type === 'boxSize') {
    return (
      <BoxSizeInput disabled={disabled} value={value} onChange={onChange} />
    );
  }

  return null;
};
