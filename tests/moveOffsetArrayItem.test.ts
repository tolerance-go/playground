import { moveOffsetArrayItem } from '@/utils/moveOffsetArrayItem';

test('moveOffsetArrayItem 数组内', () => {
  expect(
    moveOffsetArrayItem([1, 2, 3], (item) => item === 2, -1),
  ).toStrictEqual([2, 1, 3]);

  expect(moveOffsetArrayItem([1, 2, 3], (item) => item === 2, 1)).toStrictEqual(
    [1, 3, 2],
  );

  expect(
    moveOffsetArrayItem([1, 2, 3], (item) => item === 3, -1),
  ).toStrictEqual([1, 3, 2]);

  expect(moveOffsetArrayItem([1, 2, 3], (item) => item === 1, 1)).toStrictEqual(
    [2, 1, 3],
  );
});

test('moveOffsetArrayItem 边界值', () => {
  expect(
    moveOffsetArrayItem([1, 2, 3], (item) => item === 1, -1),
  ).toStrictEqual([1, 2, 3]);

  expect(moveOffsetArrayItem([1, 2, 3], (item) => item === 3, 1)).toStrictEqual(
    [1, 2, 3],
  );

  expect(moveOffsetArrayItem([], (item) => item === 3, 1)).toStrictEqual([]);

  expect(moveOffsetArrayItem([1], (item) => item === 3, 1)).toStrictEqual([1]);
});
