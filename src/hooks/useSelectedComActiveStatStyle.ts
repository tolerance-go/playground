import { useModel } from '@umijs/max';

export const useSelectedComActiveStatStyle = (comId?: string) => {
  const { comsStyles } = useModel('comsStyles', (model) => {
    return {
      comsStyles: model.comsStyles,
    };
  });

  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  if (comId && selectedComponentStatusId) {
    const style = comsStyles[comId]?.[selectedComponentStatusId];
    debugger;
    return { style };
  }

  return {
    style: undefined,
  };
};
