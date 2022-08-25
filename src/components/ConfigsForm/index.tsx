import { ConfigsFormProps } from '@/components/ConfigsForm/typings/ConfigsFormProps';
import { ProForm, ProFormDependency } from '@ant-design/pro-components';
import { ConfigFormItem } from './ConfigFormItem';
import styles from './index.less';

export const ConfigsForm = ({
  configs,
  renderLabel,
  configInputProps,
  onlyFormItem,
  formItemNamePrefix,
  renderFormItemWrapper,
  theme,
  ...formProps
}: ConfigsFormProps) => {
  const items = configs?.map((item) => {
    const renderInner = () => {
      const formControl = (
        <ConfigFormItem
          key={item.name}
          item={item}
          formItemNamePrefix={formItemNamePrefix}
          theme={theme}
          renderLabel={renderLabel}
          configInputProps={configInputProps}
        />
      );

      if (item.visible) {
        return (
          <ProFormDependency
            key={item.name}
            name={
              formItemNamePrefix
                ? [formItemNamePrefix, ...item.visible[1].dependencies]
                : item.visible[1].dependencies
            }
          >
            {(depends) => {
              return item.visible?.[0](depends) ? formControl : null;
            }}
          </ProFormDependency>
        );
      }

      return formControl;
    };

    const inner = renderInner();

    return renderFormItemWrapper?.(inner) ?? inner;
  });
  return onlyFormItem ? (
    <>{items}</>
  ) : (
    <ProForm
      {...formProps}
      className={styles.wrapper}
      submitter={{
        render: () => false,
      }}
    >
      {items}
    </ProForm>
  );
};
