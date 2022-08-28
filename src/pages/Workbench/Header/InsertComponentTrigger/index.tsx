import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// import EventInteraction from './EventInteraction';
import { useModel } from '@umijs/max';

export default () => {
  const { setMode } = useModel('workbench.siderLeftMode', (model) => ({
    setMode: model.setSiderLeftMode,
  }));

  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));

  return (
    <Button
      disabled={stageMode === 'playground'}
      type="text"
      icon={<AppstoreAddOutlined />}
      onClick={() => {
        setMode('components');
      }}
    >
      组件
    </Button>
  );
};
