import { getURLQuery } from './getURLQuery';

export const getComponentIdOrThrow = (): number => {
  const { elementType, elementId } = getURLQuery();

  if (!elementId) throw new Error('componentId 未定义');
  if (elementType !== 'component') throw new Error('elementType 类型错误');

  return Number(elementId);
};
