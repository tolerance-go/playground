import { Select, SelectProps } from 'antd';

/** 单位选择器 */
export const UnitSelect = (props: {
  value: SelectProps['value'];
  onChange?: SelectProps['onChange'];
  bordered?: boolean;
}) => {
  return (
    <Select
      bordered={props.bordered}
      size="small"
      defaultValue={'px'}
      value={props.value}
      onChange={props.onChange}
    >
      <Select.Option value="%">
        <span>%</span>
      </Select.Option>
      <Select.Option value="px">
        <span>px</span>
      </Select.Option>
    </Select>
  );
};
