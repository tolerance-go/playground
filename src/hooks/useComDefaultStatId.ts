import { useModel } from '@umijs/max';

export const useComDefaultStatId = (comId?: string) => {
  const { statusSettingsDefaults } = useModel(
    'stage.statusSettingsDefaults',
    (model) => ({
      statusSettingsDefaults: model.statusSettingsDefaults,
    }),
  );

  if (comId) {
    const defaultStatId = statusSettingsDefaults[comId];

    return { defaultStatId };
  }

  return {
    defaultStatId: undefined,
  };
};
