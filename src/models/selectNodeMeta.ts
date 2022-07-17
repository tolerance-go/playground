import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';

const useSelectNodeMeta = () => {
  const [selectNodeMeta, setSelectNodeMeta] =
    useState<StageComponentsModelItem>();
  const [selectNodeId, setSelectNodeId] = useState<string>();

  const { stageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
    }),
  );

  useEffect(() => {
    if (selectNodeId) {
      setSelectNodeMeta(stageComponentsModel?.[selectNodeId]);
    } else {
      setSelectNodeMeta(undefined);
    }
  }, [selectNodeId]);

  return {
    selectNodeId,
    selectNodeMeta,
    setSelectNodeId,
  };
};

export default useSelectNodeMeta;
