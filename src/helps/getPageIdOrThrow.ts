import { getURLQuery } from './getURLQuery';

export const getPageIdOrThrow = (): number => {
  const { elementType, elementId } = getURLQuery();

  if (!elementId) throw new Error('pageId 未定义');
  if (elementType !== 'page') throw new Error('elementType 类型错误');

  return Number(elementId);
};
