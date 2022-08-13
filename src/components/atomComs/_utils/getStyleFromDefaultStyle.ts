/** 根据默认的一些样式配置的值，转换成 react 组件可以接受的值 */

import { DefaultStylesValue } from '@/models/comsStyleConfigs';
import { joinUnitNumber } from '@/utils/joinUnitNumber';
import { CSSProperties } from 'react';

export const getStyleFromDefaultStyle = (defaultStyle?: DefaultStylesValue) => {
  const styles: CSSProperties = {
    width: joinUnitNumber(defaultStyle?.size?.width),
    height: joinUnitNumber(defaultStyle?.size?.height),
    marginTop: joinUnitNumber(defaultStyle?.marginPosition?.top),
    marginLeft: joinUnitNumber(defaultStyle?.marginPosition?.left),
    marginRight: joinUnitNumber(defaultStyle?.marginPosition?.right),
    marginBottom: joinUnitNumber(defaultStyle?.marginPosition?.bottom),
    paddingTop: joinUnitNumber(defaultStyle?.paddingPosition?.top),
    paddingLeft: joinUnitNumber(defaultStyle?.paddingPosition?.left),
    paddingRight: joinUnitNumber(defaultStyle?.paddingPosition?.right),
    paddingBottom: joinUnitNumber(defaultStyle?.paddingPosition?.bottom),
    position: defaultStyle?.positionType,
    top: joinUnitNumber(defaultStyle?.position?.top),
    left: joinUnitNumber(defaultStyle?.position?.left),
    right: joinUnitNumber(defaultStyle?.position?.right),
    bottom: joinUnitNumber(defaultStyle?.position?.bottom),
  };

  return styles;
};
