import { useModel } from '@umijs/max';

export const useComSelectedStatStyles = (comId?: string) => {
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
    const styles = comsStyles[comId]?.[selectedComponentStatusId];
    return { styles };
  }

  return {
    styles: undefined,
  };
};
