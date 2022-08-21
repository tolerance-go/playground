import { ConfigsFormProps } from '@/components/ConfigsForm/typings/ConfigsFormProps';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import {
  BetaSchemaForm,
  ProCard,
  ProFormList,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import clsx from 'clsx';
import configFormItemStyles from './ConfigFormItem.less';
import { ConfigInput } from './ConfigInput';
import styles from './index.less';

export const ConfigFormItem = ({
  item,
  formItemNamePrefix,
  theme,
  renderLabel,
  configInputProps,
}: {
  item: SettingFormConfig[number];
} & Pick<
  ConfigsFormProps,
  'renderLabel' | 'formItemNamePrefix' | 'configInputProps' | 'theme'
>) => {
  const commonFormItemProps = {
    className: clsx({
      [styles.labelAlignLeft]: item.labelAlignLeft ?? true,
      [styles.formItemSplit]: item.formItemSplit,
    }),
    ...(item.verticalLayout
      ? {
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        }
      : undefined),
    label: renderLabel?.(item) ?? item.label,
    name: formItemNamePrefix ? [formItemNamePrefix, item.name] : item.name,
    colon: false,
  };

  const extraInputProps = configInputProps?.(item);

  if (item.type === 'list') {
    return (
      <ProFormList
        {...commonFormItemProps}
        rules={[
          {
            validator: async (rule, value) => {
              if (item.required) {
                if (value === undefined) {
                  throw new Error('必填');
                }
              }
            },
          },
        ]}
        itemRender={({ listDom, action }, { record }) => {
          return (
            <ProCard
              className={configFormItemStyles.tableColumnSettingCard}
              bordered
              extra={action}
              title={record?.name}
              style={{
                marginBottom: 8,
                padding: 0,
              }}
            >
              {listDom}
            </ProCard>
          );
        }}
      >
        <BetaSchemaForm
          layoutType="Embed"
          columns={item.columns.map((col) => ({
            ...col,
            fieldProps: {
              ...col.fieldProps,
              disabled: extraInputProps?.disabled,
            },
          }))}
        />
      </ProFormList>
    );
  }

  return (
    <Form.Item
      {...commonFormItemProps}
      rules={[
        ...(item.required
          ? [
              {
                required: true,
              },
            ]
          : []),
      ]}
    >
      <ConfigInput
        {...extraInputProps}
        config={item}
        theme={theme}
        formItemNamePrefix={formItemNamePrefix}
      />
    </Form.Item>
  );
};
