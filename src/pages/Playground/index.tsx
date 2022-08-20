import Stage from '@/components/Stage';
import { useModel } from '@umijs/max';
import { DiscussDetail } from './DiscussDetail';
import Executor from './Executor';
import { HandlerBar } from './HandlerBar';
import { StageInnerWrapper } from './StageInnerWrapper';

export default function App() {
  const { mode } = useModel('playground', (model) => ({
    mode: model.mode,
  }));

  return (
    <div
      style={{
        cursor: mode === 'discuss' ? 'help' : 'default',
        background: '#f1f2f5',
        minHeight: '100vh',
      }}
    >
      <DiscussDetail />
      <Executor />
      <Stage renderInner={(inner) => <StageInnerWrapper>{inner}</StageInnerWrapper>} />
      <HandlerBar />
    </div>
  );
}
