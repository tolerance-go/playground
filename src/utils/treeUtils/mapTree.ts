export const mapTree = <
  T extends {
    children?: T[];
    [key: string]: any;
  },
  RT,
>(
  tree: T[] | undefined,
  callback: (node: T) => RT,
): (RT & {
  children?: RT[];
})[] => {
  return (
    tree?.map((item) => {
      if (item.children) {
        return {
          ...callback(item),
          children: mapTree(item.children, callback),
        };
      } else {
        return callback(item);
      }
    }) ?? []
  );
};
