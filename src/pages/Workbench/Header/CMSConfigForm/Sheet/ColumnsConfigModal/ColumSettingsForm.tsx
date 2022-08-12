import { ConfigsForm } from '@/components/ConfigsForm';
import { useFormReset } from '@/hooks/useFormReset';
import { useSelectedData } from '@/hooks/useSelectedData';
import { DataControllerUpdate } from '@/services/server/DataController';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Empty, Form, message, Result } from 'antd';
import utl from 'lodash';

export const ColumSettingsForm = () => {
  const { selectedData } = useSelectedData();

  const { columnsSettings } = selectedData?.data ?? {};
  const [form] = Form.useForm();

  const {
    dataColumnSettingsConfigs,
    updateColumn,
    getColumnDataMetaAfterUpdateColumnSettings,
  } = useModel('dataList', (model) => ({
    dataColumnSettingsConfigs: model.dataColumnSettingsConfigs,
    getColumnDataMetaAfterUpdateColumnSettings:
      model.getColumnDataMetaAfterUpdateColumnSettings,
    updateColumn: model.updateColumn,
  }));

  const { selectedColumnFieldId } = useModel('dataFieldsConfig', (model) => ({
    selectedColumnFieldId: model.selectedColumnFieldId,
  }));

  const { selectedDataId } = useModel('selectedDataId', (model) => ({
    selectedDataId: model.selectedDataId,
  }));

  const deboucneUpdate = useMemoizedFn(
    utl.debounce(async (values: Record<string, any>) => {
      if (!selectedDataId || !selectedColumnFieldId) return;

      const { data } = getColumnDataMetaAfterUpdateColumnSettings(
        selectedDataId,
        selectedColumnFieldId,
        values,
      );

      const { success } = await DataControllerUpdate(
        {
          id: String(selectedDataId),
        },
        JSON.stringify(data),
      );

      if (success) {
        message.success('更新成功');
        updateColumn(
          selectedDataId,
          selectedColumnFieldId,
          data?.columnsSettings?.[selectedColumnFieldId] ?? {},
        );
      }
    }, 350),
  );

  const colSettings = selectedColumnFieldId
    ? columnsSettings?.[selectedColumnFieldId]
    : undefined;

  useFormReset(form, selectedColumnFieldId, colSettings);

  if (!selectedColumnFieldId || !selectedData) {
    return <Empty />;
  }

  if (!colSettings) {
    return <Result status={'error'} title="未找到对应配置"></Result>;
  }

  return (
    <ConfigsForm
      form={form}
      configs={dataColumnSettingsConfigs[colSettings.type]}
      onValuesChange={(changedValues, values) => {
        deboucneUpdate(values);
      }}
    />
  );
};
