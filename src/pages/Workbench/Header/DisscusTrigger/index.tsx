import { CommentOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button } from 'antd';

export const DisscusTrigger = () => {
  const { setMode, stageMode } = useModel('stage.stageMode', (model) => ({
    setMode: model.setStageMode,
    stageMode: model.stageMode,
  }));
  const { setPlaygroundMode } = useModel('playground', (model) => ({
    setPlaygroundMode: model.setMode,
  }));
  return (
    <Button
      type="text"
      icon={<CommentOutlined />}
      onClick={() => {
        setMode((prev) => {
          if (prev === 'playground') {
            return 'workbench';
          }
          return 'playground';
        });
        setPlaygroundMode('discuss');
      }}
    >
      {stageMode === 'playground' ? '关闭讨论' : '讨论'}
    </Button>
  );
};
