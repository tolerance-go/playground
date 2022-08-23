export const convertListToMap = <
  T extends {
    id: string | number;
    [key: string]: any;
  },
>(
  list: T[],
): Record<string, T> => {
  return list.reduce((acc, next) => {
    return {
      ...acc,
      [next.id]: next,
    };
  }, {});
};
