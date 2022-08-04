import { useModel } from '@umijs/max';

export const useComponentUsedSettings = (comId?: string) => {
  const { componentsStatus } = useModel('statusSettings', (model) => {
    return {
      componentsStatus: model.componentsStatus,
    };
  });

  const { statusSettingsUsed } = useModel('statusSettingsUsed', (model) => ({
    statusSettingsUsed: model.statusSettingsUsed,
  }));

  if (comId) {
    const usedStatId = statusSettingsUsed[comId];

    const { settings } = componentsStatus[comId]?.[usedStatId]?.configs ?? {};
    return { settings, usedStatId };
  }

  return {
    settings: undefined,
  };
};
