import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { useState } from 'react';

export type ComActionsConfig = {
  type: string;
  name: string;
  settingsConfigs?: SettingFormConfig;
};

const switchStatusAction: ComActionsConfig = {
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
        ({ settings }) => !!settings?.targetComId,
        {
          dependencies: ['targetComId'],
        },
      ],
      options: [
        ({ settings }, { getComponentsStatus }) => {
          const comStatus = getComponentsStatus();
          return Object.keys(comStatus[settings?.targetComId] ?? {}).map(
            (statId) => {
              return {
                label: comStatus[settings?.targetComId]?.[statId].name,
                value: statId,
              };
            },
          );
        },
        {
          dependencies: ['targetComId'],
        },
      ],
    },
  ],
};

const useComsActionsConfigs = () => {
  const [comsActionsConfigs, setcomsActionsConfigs] = useState<{
    button: ComActionsConfig[];
    table: ComActionsConfig[];
    [key: string]: ComActionsConfig[];
  }>({
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
      { ...switchStatusAction },
    ],
    table: [
      {
        type: 'table:requestDataSource',
        name: '请求数据集',
        settingsConfigs: [
          {
            type: 'string',
            name: 'dataId',
            label: '数据集合id',
            required: true,
          },
        ],
      },
      { ...switchStatusAction },
    ],
  });

  return {
    comsActionsConfigs,
    setcomsActionsConfigs,
  };
};

export default useComsActionsConfigs;
