import { ComponentStatus } from '@/models/comsStatus';
import { NamePath } from 'antd/lib/form/interface';

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
      type: 'select';
      multiple?: boolean;
      options:
        | { label?: string; value: string }[]
        | ((options: {
            getSelectedComStatus: () => ComponentStatus | undefined;
          }) => { label?: string; value: string }[]);
    }
) & {
  visible?: [
    (values: Record<string, any>) => boolean,
    {
      name: NamePath[];
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
