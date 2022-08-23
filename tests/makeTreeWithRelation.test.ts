import { makeTreeWithRelation } from '@/utils/treeUtils/makeTreeWithRelation';

test('makeTreeWithRelation 数组内', () => {
  expect(
    makeTreeWithRelation(
      {
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
      },
      {
        r1: {
          id: 'r1',
          fromId: 'a',
          toId: 'b',
        },
      },
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
        },
      ],
      relationId: 'r1',
    },
    {
      name: '1',
      id: 'c',
    },
  ]);
});
