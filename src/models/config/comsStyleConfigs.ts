import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { ComponentCommonStyle } from '../page/comsStyles';

export type DefaultStylesValue = ComponentCommonStyle;

const defaultConfigs: SettingFormConfig = [
  {
    type: 'boxSize',
    name: 'size',
    label: '尺寸大小',
    verticalLayout: true,
    formItemSplit: true,
  },
  {
    type: 'boxPosition',
    name: 'marginPosition',
    label: '外边距',
    verticalLayout: true,
    formItemSplit: true,
  },
  {
    type: 'boxPosition',
    name: 'paddingPosition',
    label: '内边距',
    verticalLayout: true,
    formItemSplit: true,
  },
  {
    type: 'select',
    name: 'positionType',
    label: '定位方式',
    options: [
      {
        value: 'absolute',
        label: '绝对定位',
      },
      {
        value: 'relative',
        label: '相对定位',
      },
      {
        value: 'static',
        label: '一般定位',
      },
    ],
  },
  {
    type: 'boxPosition',
    name: 'position',
    label: '定位边距',
    verticalLayout: true,
  },
];

export type ComsInitalStyles = {
  button: DefaultStylesValue;
  line: DefaultStylesValue;
  table: DefaultStylesValue;
};

/**
 * 组件对应样式表单的描述信息
 * 及其组件对应初始化样式信息
 */
const useComsStyleConfigs = () => {
  const [comsInitalStyles, setComsInitalStyles] = useState<ComsInitalStyles>({
    button: {},
    line: {},
    table: {},
  });
  const [comsStylesConfigs, setComsStylesConfigs] = useState<
    Record<keyof ComsInitalStyles, SettingFormConfig>
  >({
    button: [...defaultConfigs],
    line: [...defaultConfigs],
    table: [...defaultConfigs],
  });

  const getComsInitalStyles = useMemoizedFn(() => {
    return comsInitalStyles;
  });

  return {
    comsInitalStyles,
    comsStylesConfigs,
    getComsInitalStyles,
    setComsInitalStyles,
    setComsStylesConfigs,
  };
};

export default useComsStyleConfigs;
