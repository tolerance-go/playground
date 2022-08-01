import { SegmentedPropsPicked } from '@/typings/SegmentedProps';
import { Segmented } from 'antd';

export const SegmentedSwitch = ({
  value,
  onChange,
  ...rest
}: {
  value?: boolean;
  onChange?: (next: boolean) => void;
} & Omit<SegmentedPropsPicked, 'value' | 'onChange' | 'options'>) => {
  return (
    <Segmented
      block
      {...rest}
      options={[
        {
          label: '是',
          value: 'true',
        },
        {
          label: '否',
          value: 'false',
        },
      ]}
      value={String(value)}
      onChange={(next) => {
        onChange?.(next === 'true');
      }}
    />
  );
};
