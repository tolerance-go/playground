import { useModel } from '@umijs/max';

export const useComponentSettings = (comId?: string) => {
  const { componentsStatus } = useModel('statusSettings', (model) => {
    return {
      componentsStatus: model.componentsStatus,
    };
  });

  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  if (comId && selectedComponentStatusId) {
    const { settings } =
      componentsStatus[comId]?.[selectedComponentStatusId]?.configs ?? {};
    return { settings };
  }

  return {
    settings: undefined,
  };
};
