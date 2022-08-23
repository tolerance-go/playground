import { mapTree } from '@/utils/treeUtils/mapTree';

test('mapTree 数组内', () => {
  expect(
    mapTree(
      [
        {
          name: '1',
          id: 'a',
          children: [
            {
              name: '1',
              id: 'b',
              parentId: 'a',
              relationId: 'r1',
            },
          ],
          relationId: 'r1',
        },
        {
          name: '1',
          id: 'c',
        },
      ] as any[],
      (item) => ({
        ...item,
        extra: item.id + '_extra',
      }),
    ),
  ).toStrictEqual([
    {
      name: '1',
      id: 'a',
      children: [
        {
          name: '1',
          id: 'b',
          parentId: 'a',
          relationId: 'r1',
          extra: 'b_extra',
        },
      ],
      relationId: 'r1',
      extra: 'a_extra',
    },
    {
      name: '1',
      id: 'c',
      extra: 'c_extra',
    },
  ]);
});
