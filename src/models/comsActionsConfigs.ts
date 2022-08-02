import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { useState } from 'react';

export type ComActionsConfig = {
  type: string;
  name: string;
  settingsConfigs?: SettingFormConfig;
};

const useComsActionsConfigs = () => {
  const [comsActionsConfigs, setcomsActionsConfigs] = useState<
    {
      button?: ComActionsConfig[];
    } & Record<string, ComActionsConfig[]>
  >({
    button: [
      {
        type: 'request',
        name: '请求远程接口',
        settingsConfigs: [
          {
            type: 'string',
            name: 'address',
            label: '请求地址',
            required: true,
          },
          {
            type: 'select',
            name: 'method',
            label: '请求方式',
            multiple: false,
            required: true,
            options: [
              {
                value: 'POST',
                label: 'POST',
              },
              {
                value: 'GET',
                label: 'GET',
              },
            ],
          },
        ],
      },
      {
        type: 'switchStatus',
        name: '切换状态',
        settingsConfigs: [
          {
            type: 'string',
            name: 'targetComId',
            label: '目标组件',
            required: true,
          },
          {
            type: 'select',
            name: 'targetStatId',
            label: '目标状态',
            required: true,
            visible: [
              ({ targetComId }) => !!targetComId,
              {
                name: ['targetComId'],
              },
            ],
            options: ({ getSelectedComStatus }) => {
              const comStatus = getSelectedComStatus();
              return Object.keys(comStatus ?? {}).map((statId) => {
                return {
                  label: comStatus?.[statId].name,
                  value: statId,
                };
              });
            },
          },
        ],
      },
    ],
  });

  return {
    comsActionsConfigs,
    setcomsActionsConfigs,
  };
};

export default useComsActionsConfigs;
