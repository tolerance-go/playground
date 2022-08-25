import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

/** 路径管理 */
const useDataFieldsConfig = () => {
  const [visible, setVisible] = useState(false);
  const [selectedColumnFieldId, setSelectedColumnFieldId] = useState<string>();

  const openModal = useMemoizedFn(() => {
    setVisible(true);
  });

  return {
    visible,
    selectedColumnFieldId,
    openModal,
    setSelectedColumnFieldId,
    setVisible,
  };
};

export default useDataFieldsConfig;
