import { PlaygroundHandlerBar } from '@/components/PlaygroundHandlerBar';
import Stage from '@/components/Stage';
import { useModel } from '@umijs/max';
import { Layout } from 'antd';

const { Content } = Layout;

export default () => {
  const { setMode } = useModel('workbench.siderLeftMode', (model) => ({
    setMode: model.setMode,
  }));

  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.mode,
  }));

  return (
    <Content
      id="workbenchWindow"
      style={{
        overflow: 'auto',
        background: '#f0f2f5',
      }}
      onClick={() => {
        /** 点击舞台，回复左边栏状态 */
        setMode('normal');
      }}
    >
      <Stage />
      {stageMode === 'playground' && <PlaygroundHandlerBar />}
    </Content>
  );
};
