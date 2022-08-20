import { useModel } from '@umijs/max';
import { useClickAway, useMemoizedFn } from 'ahooks';
import { Typography } from 'antd';
import { useRef, useState } from 'react';

/** 注意该组件处理 tempDiscuss 存在与否的两种逻辑 */
export const TitleItem = () => {
  const {
    tempDiscuss,
    tempTitleEditing,
    setTempDiscuss,
    selectedDiscuss,
    requestCreateDiscuss,
    updateSelectedDiscussContent,
    setTempTitleEditing,
  } = useModel('playground', (model) => ({
    tempDiscuss: model.tempDiscuss,
    selectedDiscuss: model.selectedDiscuss,
    tempTitleEditing: model.tempTitleEditing,
    setTempDiscuss: model.setTempDiscuss,
    requestCreateDiscuss: model.requestCreateDiscuss,
    updateSelectedDiscussContent: model.updateSelectedDiscussContent,
    setTempTitleEditing: model.setTempTitleEditing,
  }));
  const text = tempDiscuss ? tempDiscuss.title : selectedDiscuss?.title;

  const [value, setValue] = useState<string | undefined>();
  const valueRef = useRef<string | undefined>();

  const ref = useRef<HTMLDivElement>(null);

  const handlerEnd = useMemoizedFn(() => {
    if (tempDiscuss) {
      requestCreateDiscuss({
        ...tempDiscuss,
        title: valueRef.current,
      });
    } else {
      updateSelectedDiscussContent({
        /** 防止拿到旧数据，原因未知 */
        title: valueRef.current,
      });
      setTempTitleEditing(false);
    }
  });

  useClickAway(() => {
    if (tempTitleEditing) {
      handlerEnd();
    }
  }, ref);

  return (
    <div ref={ref}>
      <Typography.Title
        level={4}
        editable={{
          autoSize: {
            maxRows: 3,
          },
          maxLength: 50,
          editing: tempTitleEditing,
          onEnd: () => {
            handlerEnd();
          },
          onCancel() {
            /** 临时状态，什么都没输入 esc，则默认退出临时状态 */
            if (tempDiscuss) {
              setTempDiscuss(undefined);
            }
          },
          onStart() {
            setTempTitleEditing(true);
          },
          onChange(value) {
            valueRef.current = value;
            setValue(value);
          },
        }}
      >
        {/* 编辑状态退出，会触发一次 onChange，如果 value 变化的话，推测，没有验证该结论 */}
        {!(value ?? text) ? (
          <Typography.Text type="secondary">标题信息</Typography.Text>
        ) : (
          value ?? text
        )}
      </Typography.Title>
    </div>
  );
};
