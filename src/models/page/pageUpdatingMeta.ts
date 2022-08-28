import { useGetImmer } from '@/utils/useGetImmer';
import { useMemoizedFn } from 'ahooks';

export default () => {
  const [updatingPageId, setUpdatingPageId] = useGetImmer<string>();

  const stopUpdating = useMemoizedFn(() => {
    setUpdatingPageId(undefined);
  });

  const selectPageToUpdating = useMemoizedFn((id: string) => {
    setUpdatingPageId(id);
  });

  return {
    updatingPageId,
    selectPageToUpdating,
    stopUpdating,
  };
};
