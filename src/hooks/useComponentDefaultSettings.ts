import { useModel } from '@umijs/max';

export const useComponentDefaultSettings = (comId?: string) => {
  const { componentsStatus } = useModel('statusSettings', (model) => {
    return {
      componentsStatus: model.componentsStatus,
    };
  });

  const { statusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => ({
      statusSettingsDefaults: model.statusSettingsDefaults,
    }),
  );

  if (comId) {
    const defaultStatId = statusSettingsDefaults[comId];

    const { settings } =
      componentsStatus[comId]?.[defaultStatId]?.configs ?? {};
    return { settings };
  }

  return {
    settings: undefined,
  };
};
