import { useModel } from '@umijs/max';
import { Typography } from 'antd';
import { useRef, useState } from 'react';

/** 注意该组件处理 tempDiscuss 存在与否的两种逻辑 */
export const TitleItem = () => {
  const { selectedDiscuss, updateSelectedDiscussContent } = useModel(
    'playground',
    (model) => ({
      selectedDiscuss: model.selectedDiscuss,
      updateSelectedDiscussContent: model.updateSelectedDiscussContent,
    }),
  );

  const text = selectedDiscuss?.title;

  const valueRef = useRef<string | undefined>(text);

  const [value, setValue] = useState(text);

  return (
    <Typography.Title
      level={location.pathname === '/workbench' ? 5 : 4}
      editable={{
        autoSize: {
          maxRows: 3,
        },
        maxLength: 50,
        onEnd: () => {
          updateSelectedDiscussContent({
            title: valueRef.current,
          });
        },
        onChange(value) {
          valueRef.current = value;
          /** setValue 在 onEnd 的时候，拿不到最新 */
          setValue(value);
        },
      }}
    >
      {!text ? (
        <Typography.Text type="secondary">标题信息</Typography.Text>
      ) : (
        value || text
      )}
    </Typography.Title>
  );
};
