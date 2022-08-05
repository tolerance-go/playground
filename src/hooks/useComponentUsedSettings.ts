import { useModel } from '@umijs/max';

export const useComponentUsedSettings = (comId?: string) => {
  const { componentsStatus } = useModel('statusSettings', (model) => {
    return {
      componentsStatus: model.componentsStatus,
    };
  });

  const { comsStyles } = useModel('comsStyles', (model) => {
    return {
      comsStyles: model.comsStyles,
    };
  });

  const { statusSettingsUsed } = useModel('statusSettingsUsed', (model) => ({
    statusSettingsUsed: model.statusSettingsUsed,
  }));

  if (comId) {
    const usedStatId = statusSettingsUsed[comId];

    const { settings } = componentsStatus[comId]?.[usedStatId]?.configs ?? {};
    const styles = comsStyles[comId]?.[usedStatId];
    return { settings, styles, usedStatId };
  }

  return {
    usedStatId: undefined,
    styles: undefined,
    settings: undefined,
  };
};
