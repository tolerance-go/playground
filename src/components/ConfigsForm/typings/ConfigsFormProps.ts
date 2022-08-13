import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { ProFormProps } from '@ant-design/pro-components';
import React from 'react';
import { ConfigInputProps } from './ConfigInputProps';

export type ConfigsFormProps = {
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
} & ProFormProps;
