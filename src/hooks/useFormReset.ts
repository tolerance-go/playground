import { useModel } from '@umijs/max';
import { FormInstance } from 'antd';
import { useLayoutEffect } from 'react';

export const useFormReset = (
  form: FormInstance,
  data?: Record<string, any>,
) => {
  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  useLayoutEffect(() => {
    form.resetFields();
    form.setFieldsValue(data);
  }, [selectedComponentStatusId]);
};
