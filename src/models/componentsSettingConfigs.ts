import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { LineConfig } from '@ant-design/plots';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

/**
 * 组件对应配置表单的描述信息
 * 及其组件对应初始化配置信息
 */
const useComponentsSettingConfigs = () => {
  const [comsInitalSettings, setComsInitalSettings] = useState<
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
  const [componentsConfigs, setComponentsConfigs] = useState<
    Record<string, SettingFormConfig>
  >({
    button: [
      {
        type: 'string',
        name: 'text',
        label: '内容',
        required: true,
      },
      {
        type: 'select',
        name: 'type',
        label: '类型',
        multiple: false,
        options: [
          {
            label: 'primary',
            value: 'primary',
          },
          {
            label: 'ghost',
            value: 'ghost',
          },
        ],
      },
    ],
    line: [
      {
        type: 'boolean',
        name: 'smooth',
        label: '平滑绘制',
      },
    ],
  });

  const getLatestComsInitalSettings = useMemoizedFn(() => {
    return comsInitalSettings;
  });

  return {
    comsInitalSettings,
    componentsConfigs,
    getLatestComsInitalSettings,
    setComsInitalSettings,
    setComponentsConfigs,
  };
};

export default useComponentsSettingConfigs;
