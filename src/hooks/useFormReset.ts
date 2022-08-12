import { FormInstance } from 'antd';
import { useLayoutEffect } from 'react';

export const useFormReset = (
  form: FormInstance,
  selectedId?: string | number,
  data?: Record<string, any>,
) => {
  useLayoutEffect(() => {
    form.resetFields();
    form.setFieldsValue(data);
  }, [selectedId]);
};
