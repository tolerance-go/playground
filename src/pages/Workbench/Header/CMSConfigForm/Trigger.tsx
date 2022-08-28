import { DatabaseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button } from 'antd';

export const Trigger = () => {
  const { open } = useModel('database.dataMaskVisible', (model) => ({
    open: model.open,
  }));
  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));
  return (
    <Button
      disabled={stageMode === 'playground'}
      type="text"
      icon={<DatabaseOutlined />}
      onClick={() => {
        open();
      }}
    >
      数据
    </Button>
  );
};
