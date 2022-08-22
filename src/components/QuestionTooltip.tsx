import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useState } from 'react';
import styles from './QuestionTooltip.less';

export const QuestionTooltip = (props: { title: string }) => {
  const [actived, setActived] = useState(false);
  return (
    <Tooltip title={props.title}>
      <QuestionCircleOutlined
        className={styles.item}
        style={{
          cursor: 'pointer',
          color: actived ? undefined : '#ccc',
        }}
        onMouseEnter={() => {
          setActived(true);
        }}
        onMouseLeave={() => {
          setActived(false);
        }}
      />
    </Tooltip>
  );
};
