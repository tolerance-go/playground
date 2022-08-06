import { useModel } from '@umijs/max';
import { FormInstance } from 'antd';
import { useEffect } from 'react';

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

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(data);
  }, [selectedComponentStatusId]);
};
