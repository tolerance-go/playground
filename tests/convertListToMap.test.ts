import { convertListToMap } from '@/utils/listUtils/convertListToMap';

test('convertListToMap 数组内', () => {
  expect(
    convertListToMap([
      {
        name: '1',
        id: 'a',
      },
      {
        name: '1',
        id: 'b',
      },
      {
        name: '1',
        id: 'c',
      },
    ]),
  ).toStrictEqual({
    a: {
      name: '1',
      id: 'a',
    },
    b: {
      name: '1',
      id: 'b',
    },
    c: {
      name: '1',
      id: 'c',
    },
  });
});
