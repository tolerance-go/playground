import { SegmentedSwitch } from '@/components/SegmentedSwitch';
import { useSelectedComponentStatus } from '@/hooks/selected/useSelectedComponentStatus';
import { RecordType } from '@/typings';
import { WithDependencies } from '@/typings/SettingFormConfig';
import { ProFormDependency } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Input, Select } from 'antd';
import BoxPositionInput from './inputs/BoxPositionInput';
import BoxSizeInput from './inputs/BoxSizeInput';
import { ConfigInputProps } from './typings/ConfigInputProps';

const isWithDependenciesLike = <T extends (...args: any[]) => any, O>(
  item: WithDependencies<T> | O,
): item is WithDependencies<T> => {
  return (
    Array.isArray(item) &&
    item.length === 2 &&
    typeof item[0] === 'function' &&
    typeof item[1] === 'object' &&
    Array.isArray(item[1].dependencies)
  );
};

export const ConfigInput = ({
  config,
  value,
  onChange,
  disabled,
  bordered,
  theme,
  formItemNamePrefix,
}: ConfigInputProps) => {
  const { getSelectedComStatus } = useSelectedComponentStatus();

  const { getComponentsStatus } = useModel('page.comsStatus', (model) => {
    return {
      getComponentsStatus: model.getComponentsStatus,
    };
  });

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
    const dependencies = (() => {
      const arr = [];

      if (isWithDependenciesLike(config.options)) {
        arr.push(...config.options[1].dependencies);
      }

      return arr;
    })();

    const hasDependency = !!dependencies.length;

    const renderInput = (depends?: RecordType) => {
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
          options={(() => {
            if (typeof config.options === 'function') {
              return config.options({
                getSelectedComStatus,
                getComponentsStatus,
              });
            }

            if (isWithDependenciesLike(config.options)) {
              return config.options[0](depends!, {
                getSelectedComStatus,
                getComponentsStatus,
              });
            }

            return config.options;
          })()}
          bordered={bordered}
        />
      );
    };

    if (hasDependency) {
      return (
        <ProFormDependency
          name={
            formItemNamePrefix
              ? [formItemNamePrefix, ...dependencies]
              : dependencies
          }
        >
          {(depends) => {
            debugger;
            return renderInput(depends);
          }}
        </ProFormDependency>
      );
    }

    return renderInput();
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
