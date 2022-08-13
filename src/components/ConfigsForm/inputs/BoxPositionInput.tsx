import { BoxPosition, UnitNumber } from '@/models/comsStyles';
import { useMemoizedFn } from 'ahooks';
import { InputNumber, Row } from 'antd';
import { UnitSelect } from '../../UnitSelect';

export default (props: {
  disabled?: boolean;
  value?: BoxPosition;
  onChange?: (value: BoxPosition) => void;
  bordered?: boolean;
}) => {
  const handleChange = useMemoizedFn(
    (next: number, pos: 'top' | 'left' | 'right' | 'bottom') => {
      props.onChange?.({
        ...props.value,
        [pos]: {
          ...props.value?.[pos],
          value: next,
        },
      });
    },
  );

  const handleUnitChange = useMemoizedFn(
    (next: UnitNumber['unit'], pos: 'top' | 'left' | 'right' | 'bottom') => {
      props.onChange?.({
        ...props.value,
        [pos]: {
          ...props.value?.[pos],
          unit: next,
        },
      });
    },
  );

  return (
    <div>
      <Row
        justify="center"
        style={{
          marginBottom: 15,
        }}
      >
        <InputNumber
          size="small"
          onChange={(next) => handleChange(next, 'top')}
          style={{ width: '46%' }}
          disabled={props.disabled}
          placeholder="上"
          value={props.value?.top?.value}
          addonAfter={
            <UnitSelect
              bordered={props.bordered}
              disabled={props.disabled}
              value={props.value?.top?.unit}
              onChange={(next) => handleUnitChange(next, 'top')}
            />
          }
        />
      </Row>
      <Row
        justify="space-between"
        style={{
          marginBottom: 15,
        }}
      >
        <InputNumber
          size="small"
          onChange={(next) => handleChange(next, 'left')}
          style={{ width: '46%' }}
          disabled={props.disabled}
          placeholder="左"
          value={props.value?.left?.value}
          addonAfter={
            <UnitSelect
              bordered={props.bordered}
              disabled={props.disabled}
              value={props.value?.left?.unit}
              onChange={(next) => handleUnitChange(next, 'left')}
            />
          }
        />
        <InputNumber
          onChange={(next) => handleChange(next, 'right')}
          size="small"
          style={{ width: '46%' }}
          disabled={props.disabled}
          placeholder="右"
          value={props.value?.right?.value}
          addonAfter={
            <UnitSelect
              bordered={props.bordered}
              disabled={props.disabled}
              value={props.value?.right?.unit}
              onChange={(next) => handleUnitChange(next, 'right')}
            />
          }
        />
      </Row>
      <Row justify="center">
        <InputNumber
          size="small"
          onChange={(next) => handleChange(next, 'bottom')}
          style={{ width: '46%' }}
          disabled={props.disabled}
          placeholder="下"
          value={props.value?.bottom?.value}
          addonAfter={
            <UnitSelect
              bordered={props.bordered}
              disabled={props.disabled}
              value={props.value?.bottom?.unit}
              onChange={(next) => handleUnitChange(next, 'bottom')}
            />
          }
        />
      </Row>
    </div>
  );
};
