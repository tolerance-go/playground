/** 将一个数组中的元素进行位置相对移动
 * offset: 1 就是向数组末尾方向移动，-1 为数组起始方向移动
 */

export const moveOffsetArrayItem = <T>(
  arr: T[],
  isTarget: (target: T) => boolean,
  offset: 1 | -1,
) => {
  if (arr.length < 2) {
    return arr;
  }

  const targetIndex = arr.findIndex(isTarget);

  if (targetIndex > -1) {
    if (offset === 1 && targetIndex === arr.length - 1) {
      return arr;
    }

    if (offset === -1 && targetIndex === 0) {
      return arr;
    }

    const nextArr = [...arr];
    const [removed] = nextArr.splice(targetIndex, 1);
    nextArr.splice(targetIndex + offset, 0, removed);
    return nextArr;
  }
  return arr;
};
