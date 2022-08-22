import { ComponentCommonStyle } from '@/models/comsStyles';
import { PropsWithChildren } from 'react';

/** 可以自行转换外观表单的参数 */
export const AtomRuntimeWrapper = (
  props: PropsWithChildren<{
    style?: ComponentCommonStyle;
  }>,
) => {
  console.log(props.style);
  return (
    <div
    // style={{
    //   ...props.style,
    //   border: '1px solid green',
    // }}
    >
      {props.children}
    </div>
  );
};
