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
      defaultValue={'absolute'}
      value={props.value}
      onChange={props.onChange}
    >
      <Select.Option value="percentage">
        <span
          style={{
            fontSize: 10,
          }}
        >
          百分比
        </span>
      </Select.Option>
      <Select.Option value="absolute">
        <span
          style={{
            fontSize: 10,
          }}
        >
          绝对值
        </span>
      </Select.Option>
    </Select>
  );
};
