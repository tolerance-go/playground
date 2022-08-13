import { SegmentedSwitch } from '@/components/SegmentedSwitch';
import { useSelectedComponentStatus } from '@/hooks/useSelectedComponentStatus';
import { Input, Select } from 'antd';
import BoxPositionInput from './inputs/BoxPositionInput';
import BoxSizeInput from './inputs/BoxSizeInput';
import { ConfigInputProps } from './typings/ConfigInputProps';

export const ConfigInput = ({
  config,
  value,
  onChange,
  disabled,
  bordered,
  theme,
}: ConfigInputProps) => {
  const { getSelectedComStatus } = useSelectedComponentStatus();

  if (config.type === 'string') {
    return (
      <Input
        style={
          theme === 'dark-area'
            ? {
                background: '#f3f3f3',
                borderRadius: '4px',
              }
            : undefined
        }
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
        style={
          theme === 'dark-area'
            ? {
                background: '#f3f3f3',
                borderRadius: '4px',
              }
            : undefined
        }
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

  if (config.type === 'boxPosition') {
    return (
      <BoxPositionInput
        bordered={bordered}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (config.type === 'boxSize') {
    return (
      <BoxSizeInput
        bordered={bordered}
        disabled={disabled}
        value={value}
        onChange={onChange}
      ></BoxSizeInput>
    );
  }

  return null;
};
