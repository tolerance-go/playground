import { useModel } from '@umijs/max';

export const useComActiveStatStyle = (comId?: string) => {
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
    const styles = comsStyles[comId]?.[selectedComponentStatusId];
    return { styles };
  }

  return {
    styles: undefined,
  };
};
