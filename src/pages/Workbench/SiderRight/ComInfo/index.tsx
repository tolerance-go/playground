import { useModel } from '@umijs/max';
import { Typography } from 'antd';

export const ComInfo = () => {
  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >
      <Typography.Text
        copyable={{
          text: stageSelectNodeId,
        }}
      >
        ID: {stageSelectNodeId}
      </Typography.Text>
    </div>
  );
};
