import { PlaygroundMode } from '@/models/playground';
import { useModel } from '@umijs/max';
import { Segmented } from 'antd';
import styles from './HandlerBar.less';

export const HandlerBar = () => {
  const { mode, setMode, setDetailMode, setDetailVisible } = useModel(
    'playground',
    (model) => ({
      mode: model.mode,
      setMode: model.setMode,
      setDetailMode: model.setDetailMode,
      setDetailVisible: model.setDetailVisible,
    }),
  );
  return (
    <div
      className={styles.wrap}
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '4px',
        background: '#fff',
      }}
    >
      <Segmented
        block
        value={mode}
        options={[
          {
            label: '交互',
            value: 'cursor',
          },
          {
            label: '讨论',
            value: 'discuss',
          },
        ]}
        onChange={(val) => {
          setMode(val as PlaygroundMode);
          if (val === 'discuss') {
            setDetailMode('list');
            setDetailVisible(true);
          }
        }}
      />
    </div>
  );
};
