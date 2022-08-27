import { useModel } from '@umijs/max';

/**
 * 
getInitialState 不反回，页面内 useModel('@@initialState') 不会渲染

model 内的 useModel('@@initialState') 会初始调一次

如果 getInitialState 发生异常，如果在 layout 拦截渲染，页面内 useModel 的地方始终不会渲染

而 model 内的 useModel 会再次触发

getInitialState 配合 layout 拦截，可以将一些必须的全站的初始化信息放在里面获取

并可以保证 initialState 一定有数据
 */
export const useInitialState = () => {
  const { initialState, ...rest } = useModel('@@initialState');

  return {
    initialState: initialState as Exclude<typeof initialState, undefined>,
    ...rest,
  };
};
