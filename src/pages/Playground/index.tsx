import { DiscussInfos } from '@/components/DiscussInfos';
import { PlaygroundHandlerBar } from '@/components/PlaygroundHandlerBar';
import Stage from '@/components/Stage';
import { DiscussDrawer } from './DiscussDrawer';
import Global from './Global';

export default function App() {
  return (
    <div
      id="playgroundWindow"
      style={{
        background: '#f0f2f5',
        minHeight: '100vh',
        overflow: 'auto',
      }}
    >
      <DiscussDrawer>
        <DiscussInfos />
      </DiscussDrawer>
      <Global />
      <Stage />
      <PlaygroundHandlerBar />
    </div>
  );
}
