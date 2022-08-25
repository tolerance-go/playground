import { useModel } from '@umijs/max';

export const useSelectedComActiveStatStyle = (comId?: string) => {
  const { comsStyles } = useModel('page.comsStyles', (model) => {
    return {
      comsStyles: model.comsStyles,
    };
  });

  const { selectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  if (comId && selectedComponentStatusId) {
    const style = comsStyles[comId]?.[selectedComponentStatusId];
    return { style };
  }

  return {
    style: undefined,
  };
};
