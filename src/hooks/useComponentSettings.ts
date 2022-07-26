import { useModel } from '@umijs/max';

export const useComponentSettings = (comId?: string) => {
  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatus',
    (model) => ({
      selectedComponentStatusId: model?.selectedComponentStatusId,
    }),
  );

  const { settings } = useModel('statusSettings', (model) => {
    if (comId && selectedComponentStatusId) {
      const { settings } =
        model?.componentsStatus[comId]?.[selectedComponentStatusId]?.configs ??
        {};
      return {
        settings,
      };
    }
    return {
      settings: undefined,
    };
  });

  return {
    settings,
  };
};
