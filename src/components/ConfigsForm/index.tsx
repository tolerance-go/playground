import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { ProFormDependency } from '@ant-design/pro-components';
import { Form, FormProps, Input, Select, Switch } from 'antd';
import React from 'react';
import { ConfigInput, ConfigInputProps } from './ConfigInput';

const SettingInputs: Record<string, React.ElementType<any>> = {
  string: Input,
  boolean: Switch,
  select: Select,
};

export const ConfigsForm = ({
  configs,
  renderLabel,
  configInputProps,
  ...formProps
}: {
  configs?: SettingFormConfig;
  renderLabel?: (config: SettingFormConfig[number]) => React.ReactNode;
  configInputProps?: (
    config: SettingFormConfig[number],
  ) => Omit<ConfigInputProps, 'config'>;
} & FormProps) => {
  return (
    <Form {...formProps}>
      {configs?.map((item) => {
        if (SettingInputs[item.type] === undefined) {
          return null;
        }

        const formControl = (
          <Form.Item
            required={item.required}
            key={item.name}
            label={renderLabel?.(item) ?? item.label}
            name={item.name}
            colon={false}
          >
            <ConfigInput {...configInputProps?.(item)} config={item} />
          </Form.Item>
        );

        if (item.visible) {
          return (
            <ProFormDependency name={item.visible[1].name}>
              {(depends) => {
                return item.visible?.[0](depends) ? formControl : null;
              }}
            </ProFormDependency>
          );
        }

        return formControl;
      })}
    </Form>
  );
};
