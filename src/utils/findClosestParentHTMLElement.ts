/** 找到元素最近的复合条件的父级 */

export const findClosestParentHTMLElement = (
  target: HTMLElement | undefined | null,
  callback: (el: HTMLElement) => boolean,
): HTMLElement | undefined => {
  if (target === undefined || target === null) {
    return undefined;
  }

  if (callback(target)) {
    return target;
  }
  if (target.parentElement) {
    return findClosestParentHTMLElement(target.parentElement, callback);
  }
  return undefined;
};
