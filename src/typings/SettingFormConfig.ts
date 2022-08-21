import { ComponentsStatus, ComponentStatus } from '@/models/comsStatus';
import { ProFormColumnsType } from '@ant-design/pro-components';
import { NamePath } from 'antd/lib/form/interface';
import { RecordType } from './index';

export type SelectOptionsFn = (options: {
  getComponentsStatus: () => ComponentsStatus;
  getSelectedComStatus: () => ComponentStatus | undefined;
}) => { label?: string; value: string }[];

export type WithDependencies<T extends (...args: any[]) => any> = [
  (depends: RecordType, ...args: Parameters<T>) => ReturnType<T>,
  {
    dependencies: NamePath[];
  },
];

export type SettingFormConfig = ((
  | {
      type: 'string';
    }
  | {
      type: 'boolean';
    }
  | {
      type: 'boxSize';
    }
  | {
      type: 'boxPosition';
    }
  | {
      type: 'list';
      columns: ProFormColumnsType[];
    }
  | {
      type: 'select';
      multiple?: boolean;
      options:
        | { label?: string; value: string }[]
        | SelectOptionsFn
        | WithDependencies<SelectOptionsFn>;
    }
) & {
  visible?: [
    (values: Record<string, any>) => boolean,
    {
      dependencies: NamePath[];
    },
  ];
  name: string;
  label: string;
  required?: boolean;
  /** formItem 垂直布局 */
  verticalLayout?: boolean;
  /** label 是否左对齐 */
  labelAlignLeft?: boolean;
  /** 是否显示分割线 */
  formItemSplit?: boolean;
})[];
