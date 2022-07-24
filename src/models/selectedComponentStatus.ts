import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

const selectedComponentStatus = () => {
  /** 当前组件应用的状态 */
  const [selectedComponentStatusId, setSelectedComponentStatusId] =
    useState<string>();

  const getSelectedComponentStatusId = useMemoizedFn(() => {
    return selectedComponentStatusId;
  });

  return {
    selectedComponentStatusId,
    setSelectedComponentStatusId,
    getSelectedComponentStatusId,
  };
};

export default selectedComponentStatus;
