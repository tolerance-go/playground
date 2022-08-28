import { useGetImmer } from '@/utils/useGetImmer';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export default () => {
  const [creatingMeta, setCreatingMeta] = useGetImmer<{
    isCreating: boolean;
    defaultInputValue?: string;
  }>({
    isCreating: false,
  });

  const { getList } = useModel('page.pageList', (model) => ({
    getList: model.getList,
  }));

  /** 设置输入框的 value，根据 list 下标 */
  const setTempInputValueByIndex = useMemoizedFn(() => {
    setCreatingMeta({
      isCreating: true,
      defaultInputValue: `/page${(getList() ?? []).length}`,
    });
  });

  /** 设置输入框 value，根据点击的对象 */
  const setTempInputValueByTarget = useMemoizedFn((target: API.ShownPage) => {
    setCreatingMeta({
      isCreating: true,
      defaultInputValue: `${target.path}-2`,
    });
  });

  const stopTempInput = useMemoizedFn(() => {
    setCreatingMeta({
      isCreating: false,
    });
  });

  return {
    creatingMeta,
    setTempInputValueByIndex,
    setTempInputValueByTarget,
    stopTempInput,
  };
};
