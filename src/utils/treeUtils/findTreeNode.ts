export const findTreeNode = <
  C extends keyof T,
  T extends {
    [K in C]: T[];
  },
>(
  tree: T[],
  callback: (target: T) => boolean,
  childrenFieldName: C,
): T | undefined => {
  for (const item of tree) {
    if (callback(item)) {
      return item;
    }
    if (item[childrenFieldName]) {
      const iitem = findTreeNode(
        item[childrenFieldName],
        callback,
        childrenFieldName,
      );

      if (iitem) {
        return iitem;
      }
    }
  }

  return undefined;
};
