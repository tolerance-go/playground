import { ComponentStatus } from '@/models/statusSettings';
import { NamePath } from 'antd/lib/form/interface';

export type SettingFormConfig = ((
  | {
      type: 'string';
    }
  | {
      type: 'boolean';
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
})[];
