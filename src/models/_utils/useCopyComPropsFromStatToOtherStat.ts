import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { ComponentsActions } from '../comsActions';
import { ComponentsEvents } from '../comsEvents';

/** 拷贝组件 A 状态的配置到 B 状态 */
export const useCopyComPropsFromStatToOtherStat = (
  setComsProps:
    | ((value: React.SetStateAction<ComponentsEvents>) => void)
    | ((value: React.SetStateAction<ComponentsActions>) => void),
) => {
  const copyComPropsFromStatToOtherStat = useMemoizedFn(
    (comId: string, fromStatId: string, toStatId: string) => {
      setComsProps(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }

          if (draft[comId][fromStatId]) {
            /** 重新创建新的 id */
            draft[comId][toStatId] = Object.keys(draft[comId][fromStatId])
              .map((actionId) => {
                return {
                  ...draft[comId][fromStatId][actionId],
                  id: nanoid(),
                };
              })
              .reduce((acc, next) => {
                return {
                  ...acc,
                  [next.id]: next,
                };
              }, {});
          }
        }),
      );
    },
  );

  return {
    copyComPropsFromStatToOtherStat,
  };
};
