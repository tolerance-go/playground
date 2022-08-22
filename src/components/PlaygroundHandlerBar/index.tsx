import { QuestionTooltip } from '@/components/QuestionTooltip';
import { PlaygroundMode } from '@/models/playground';
import { useModel } from '@umijs/max';
import { Segmented, Space } from 'antd';
import styles from './index.less';

export const PlaygroundHandlerBar = () => {
  const { mode, setMode, setDetailMode } = useModel('playground', (model) => ({
    mode: model.mode,
    setMode: model.setMode,
    setDetailMode: model.setDetailMode,
  }));
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
        value={mode}
        options={[
          {
            label: '交互',
            value: 'cursor',
          },
          {
            label: (
              <Space size={5}>
                <span>讨论</span>
                <QuestionTooltip title="同时按住 alt 可以进行页面交互" />
              </Space>
            ),
            value: 'discuss',
          },
        ]}
        onChange={(val) => {
          setMode(val as PlaygroundMode);
          if (val === 'discuss') {
            setDetailMode('list');
          }
        }}
      />
    </div>
  );
};
