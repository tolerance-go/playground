import { useModel } from '@umijs/max';

export const useComActiveStatSetting = (comId?: string) => {
  const { comsSettings } = useModel('page.comsSettings', (model) => {
    return {
      comsSettings: model.comsSettings,
    };
  });

  const { selectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  if (comId && selectedComponentStatusId) {
    const settings = comsSettings[comId]?.[selectedComponentStatusId];
    return { settings };
  }

  return {
    settings: undefined,
  };
};
