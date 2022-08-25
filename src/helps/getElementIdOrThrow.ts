import { getURLQuery } from './getURLQuery';

export const getElementIdOrThrow = (): number => {
  const { pageId } = getURLQuery();

  if (!pageId) throw new Error('elementId 未定义');

  return Number(pageId);
};
