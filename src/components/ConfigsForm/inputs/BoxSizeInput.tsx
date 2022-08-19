import { UnitNumber } from '@/models/comsStyles';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Col, InputNumber, Row, Space } from 'antd';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { UnitSelect } from '../../UnitSelect';

export type BoxSizeInputValue = {
  width?: UnitNumber;
  height?: UnitNumber;
  lockingWidthRatio?: boolean;
};

export default (props: {
  bordered?: boolean;
  disabled?: boolean;
  value?: BoxSizeInputValue;
  onChange?: (value: BoxSizeInputValue) => void;
  debounceTime?: number;
}) => {
  const handleChange = useMemoizedFn(
    debounce((val: number, type: 'width' | 'height') => {
      const nextData = {
        ...props.value,
        [type]: {
          ...props.value?.[type],
          value: val,
        },
      };

      if (props.value?.lockingWidthRatio) {
        /** 如果修改的是 宽度，并且高度有值 */
        if (type === 'width' && props.value.height?.value) {
          /** 同时如果宽度原来有值，获取放大比例 */
          if (props.value.width?.value) {
            const ratio = new BigNumber(val)
              .div(props.value.width.value)
              .toNumber();
            const nextHeight = new BigNumber(props.value.height.value)
              .multipliedBy(ratio)
              .toFixed(4);
            nextData.height = {
              ...nextData.height,
              value: parseFloat(nextHeight),
            };
          }
        } else if (type === 'height' && props.value.width?.value) {
          if (props.value.height?.value) {
            const ratio = new BigNumber(val)
              .div(props.value.height.value)
              .toNumber();
            const nextWidth = new BigNumber(props.value.width.value)
              .multipliedBy(ratio)
              .toFixed(4);
            nextData.width = {
              ...nextData.height,
              value: parseFloat(nextWidth),
            };
          }
        }
      }

      props.onChange?.(nextData);
    }, props.debounceTime ?? 0),
  );

  const handleUnitChange = useMemoizedFn(
    (next: UnitNumber['unit'], type: 'width' | 'height') => {
      props.onChange?.({
        ...props.value,
        [type]: {
          ...props.value?.[type],
          unit: next,
        },
      });
    },
  );

  return (
    <div>
      <Row gutter={20}>
        <Col flex={'none'}>宽度</Col>
        <Col flex={'auto'}>
          <InputNumber
            size="small"
            onChange={(next) => handleChange(next, 'width')}
            style={{
              width: '100%',
            }}
            disabled={props.disabled}
            placeholder="请输入"
            value={props.value?.width?.value}
            addonAfter={
              <UnitSelect
                bordered={props.bordered}
                disabled={props.disabled}
                value={props.value?.width?.unit}
                onChange={(next) => handleUnitChange(next, 'width')}
              />
            }
          />
        </Col>
      </Row>
      <Row
        justify="center"
        style={{
          padding: 10,
        }}
      >
        {props.value?.lockingWidthRatio ? (
          <Space
            style={{
              cursor: 'pointer',
            }}
            size={'small'}
            onClick={() => {
              props.onChange?.({
                ...props.value,
                lockingWidthRatio: false,
              });
            }}
          >
            <span
              style={{
                fontSize: 10,
              }}
            >
              比例固定
            </span>
            <LockOutlined
              style={{
                fontSize: 12,
              }}
            />
          </Space>
        ) : (
          <Space
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              props.onChange?.({
                ...props.value,
                lockingWidthRatio: true,
              });
            }}
          >
            <span
              style={{
                fontSize: 10,
              }}
            >
              比例不固定
            </span>
            <UnlockOutlined
              style={{
                fontSize: 12,
              }}
            />
          </Space>
        )}
      </Row>
      <Row gutter={20}>
        <Col flex={'none'}>高度</Col>
        <Col flex={'auto'}>
          <InputNumber
            size="small"
            onChange={(next) => handleChange(next, 'height')}
            style={{
              width: '100%',
            }}
            disabled={props.disabled}
            placeholder="请输入"
            value={props.value?.height?.value}
            addonAfter={
              <UnitSelect
                bordered={props.bordered}
                disabled={props.disabled}
                value={props.value?.height?.unit}
                onChange={(next) => handleUnitChange(next, 'height')}
              />
            }
          />
        </Col>
      </Row>
    </div>
  );
};
