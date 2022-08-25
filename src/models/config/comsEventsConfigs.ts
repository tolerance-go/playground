import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { useState } from 'react';

export type ComEventsConfig = {
  type: string;
  name: string;
  settingsConfigs?: SettingFormConfig;
};

const useComsEventsConfigs = () => {
  const [comsEventsConfigs, setComsEventsConfigs] = useState<
    {
      button?: ComEventsConfig[];
      table?: ComEventsConfig[];
    } & Record<string, ComEventsConfig[]>
  >({
    button: [
      {
        type: 'button:click',
        name: '点击事件',
        settingsConfigs: [
          {
            type: 'string',
            name: 'keyboard',
            label: '同时按下键盘按键',
            required: false,
          },
        ],
      },
    ],
    table: [
      {
        type: 'table:didMount',
        name: '组件装载完成',
        settingsConfigs: [],
      },
    ],
  });

  return {
    comsEventsConfigs,
    setComsEventsConfigs,
  };
};

export default useComsEventsConfigs;
