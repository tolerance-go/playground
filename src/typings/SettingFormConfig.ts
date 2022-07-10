export type SettingFormConfig = ((
  | {
      type: 'string';
    }
  | {
      type: 'boolean';
    }
  | {
      type: 'select';
      multiple: boolean;
      options: { label: string; value: string }[];
    }
) & {
  name: string;
  label: string;
  required?: boolean;
})[];
