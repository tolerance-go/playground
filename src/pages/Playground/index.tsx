import Stage from '@/components/Stage';
import { DiscussDetail } from './DiscussDetail';
import Executor from './Executor';
import { HandlerBar } from './HandlerBar';
import { StageInnerWrapper } from './StageInnerWrapper';

export default function App() {
  return (
    <div
      style={{
        background: '#f1f2f5',
        minHeight: '100vh',
      }}
    >
      <DiscussDetail />
      <Executor />
      <Stage
        renderInner={(inner) => <StageInnerWrapper>{inner}</StageInnerWrapper>}
      />
      <HandlerBar />
    </div>
  );
}
