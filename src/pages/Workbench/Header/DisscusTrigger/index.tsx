import { CommentOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button } from 'antd';

export const DisscusTrigger = () => {
  const { setMode } = useModel('stageMode', (model) => ({
    setMode: model.setMode,
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
      }}
    >
      讨论
    </Button>
  );
};
