import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { ProFormDependency } from '@ant-design/pro-components';
import { Form, FormProps } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { ConfigInput, ConfigInputProps } from './ConfigInput';
import styles from './index.less';

export const ConfigsForm = ({
  configs,
  renderLabel,
  configInputProps,
  onlyFormItem,
  formItemNamePrefix,
  renderFormItemWrapper,
  theme,
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
  theme?: 'dark-area';
} & FormProps) => {
  const items = configs?.map((item) => {
    const renderInner = () => {
      const formControl = (
        <Form.Item
          className={clsx({
            [styles.labelAlignLeft]: item.labelAlignLeft ?? true,
            [styles.formItemSplit]: item.formItemSplit,
          })}
          rules={[
            ...(item.required
              ? [
                  {
                    required: true,
                  },
                ]
              : []),
          ]}
          {...(item.verticalLayout
            ? {
                labelCol: {
                  span: 24,
                },
                wrapperCol: {
                  span: 24,
                },
              }
            : undefined)}
          key={item.name}
          label={renderLabel?.(item) ?? item.label}
          name={
            formItemNamePrefix ? [formItemNamePrefix, item.name] : item.name
          }
          colon={false}
        >
          <ConfigInput
            {...configInputProps?.(item)}
            config={item}
            theme={theme}
          />
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
  return onlyFormItem ? (
    <>{items}</>
  ) : (
    <Form {...formProps} className={styles.wrapper}>
      {items}
    </Form>
  );
};
