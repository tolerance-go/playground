import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { LineConfig } from '@ant-design/plots';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

const defaultConfigs: SettingFormConfig = [
  {
    type: 'boxSize',
    name: 'marginSize',
    label: '外边距',
    verticalLayout: true,
  },
  {
    type: 'boxSize',
    name: 'paddingSize',
    label: '内边距',
    verticalLayout: true,
  },
  {
    type: 'select',
    name: 'positionType',
    label: '定位方式',
    options: [
      {
        value: 'absloute',
        label: '绝对定位',
      },
      {
        value: 'relative',
        label: '相对定位',
      },
    ],
  },
  {
    type: 'boxSize',
    name: 'positionSize',
    label: '定位边距',
    verticalLayout: true,
  },
];

/**
 * 组件对应样式表单的描述信息
 * 及其组件对应初始化样式信息
 */
const useComsStyleConfigs = () => {
  const [comsInitalStyles, setComsInitalStyles] = useState<
    {
      button?: {
        text?: string;
        type?: string;
      };
      line?: Partial<LineConfig>;
    } & Record<string, Record<string, any>>
  >({
    button: {
      text: '按钮',
      type: 'primary',
    },
    line: {
      smooth: false,
    },
  });
  const [comsStylesConfigs, setComsStylesConfigs] = useState<
    Record<string, SettingFormConfig>
  >({
    button: [
      ...defaultConfigs,
      // {
      //   type: 'string',
      //   name: 'text',
      //   label: '内容',
      //   required: true,
      // },
      // {
      //   type: 'select',
      //   name: 'type',
      //   label: '类型',
      //   multiple: false,
      //   options: [
      //     {
      //       label: 'primary',
      //       value: 'primary',
      //     },
      //     {
      //       label: 'ghost',
      //       value: 'ghost',
      //     },
      //   ],
      // },
    ],
    line: [
      {
        type: 'boolean',
        name: 'smooth',
        label: '平滑绘制',
      },
    ],
    default: [
      {
        type: 'boxSize',
        name: 'marginSize',
        label: '外边距',
      },
    ],
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
