import { DatabaseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button } from 'antd';

export const Trigger = () => {
  const { setVisible } = useModel('dataMaskVisible', (model) => ({
    setVisible: model.setVisible,
  }));

  return (
    <Button
      type="text"
      icon={<DatabaseOutlined />}
      onClick={() => {
        setVisible(true);
      }}
    >
      数据
    </Button>
  );
};
