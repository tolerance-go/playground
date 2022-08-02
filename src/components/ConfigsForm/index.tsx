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
  onlyFormItem,
  formItemNamePrefix,
  renderFormItemWrapper,
  ...formProps
}: {
  configs?: SettingFormConfig;
  renderLabel?: (config: SettingFormConfig[number]) => React.ReactNode;
  configInputProps?: (
    config: SettingFormConfig[number],
  ) => Omit<ConfigInputProps, 'config'>;
  /** 只渲染 form item */
  onlyFormItem?: boolean;
  formItemNamePrefix?: string;
  renderFormItemWrapper?: (itemDom: React.ReactNode) => React.ReactNode;
} & FormProps) => {
  const items = configs?.map((item) => {
    const renderInner = () => {
      if (SettingInputs[item.type] === undefined) {
        return null;
      }

      const formControl = (
        <Form.Item
          rules={[
            ...(item.required
              ? [
                  {
                    required: true,
                  },
                ]
              : []),
          ]}
          key={item.name}
          label={renderLabel?.(item) ?? item.label}
          name={
            formItemNamePrefix ? [formItemNamePrefix, item.name] : item.name
          }
          colon={false}
        >
          <ConfigInput {...configInputProps?.(item)} config={item} />
        </Form.Item>
      );

      if (item.visible) {
        return (
          <ProFormDependency
            name={
              formItemNamePrefix
                ? [formItemNamePrefix, ...item.visible[1].name]
                : item.visible[1].name
            }
          >
            {(depends) => {
              return item.visible?.[0](depends) ? formControl : null;
            }}
          </ProFormDependency>
        );
      }

      return formControl;
    };

    const inner = renderInner();

    return renderFormItemWrapper?.(inner) ?? inner;
  });
  return onlyFormItem ? <>{items}</> : <Form {...formProps}>{items}</Form>;
};
