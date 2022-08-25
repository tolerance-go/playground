import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';

export const PageCreator = () => {
  const { setCreatePathing, setTempInputValueByIndex } = useModel(
    'page.pageList',
    (model) => ({
      setCreatePathing: model?.setCreatePathing,
      setTempInputValue: model?.setTempInputValue,
      setTempInputValueByIndex: model?.setTempInputValueByIndex,
    }),
  );

  return (
    <PlusOutlined
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        setCreatePathing(true);
        setTempInputValueByIndex();
      }}
    />
  );
};
