import { useModel } from '@umijs/max';

export const useComDefaultStatSetting = (comId?: string) => {
  const { comsSettings } = useModel('page.comsSettings', (model) => {
    return {
      comsSettings: model.comsSettings,
    };
  });

  const { statusSettingsDefaults } = useModel(
    'page.statusSettingsDefaults',
    (model) => ({
      statusSettingsDefaults: model.statusSettingsDefaults,
    }),
  );

  if (comId) {
    const defaultStatId = statusSettingsDefaults[comId];
    const settings = comsSettings[comId]?.[defaultStatId];
    return { settings };
  }

  return {
    settings: undefined,
  };
};
