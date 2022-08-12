import { useModel } from '@umijs/max';
import { FormInstance } from 'antd';
import { useFormReset } from './useFormReset';

export const useComStatFormReset = (
  form: FormInstance,
  data?: Record<string, any>,
) => {
  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  useFormReset(form, selectedComponentStatusId, data);
};
