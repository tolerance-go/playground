import { Atom } from '@/components/Atom';
import { AtomButton } from '@/components/atomComs/AtomButton';
import { ElementsCxt } from '@/components/ElementsCtx';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { ElementCenter } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useMemo } from 'react';
import { AtomTable } from '../atomComs/AtomTable';
import { AtomLine } from '../atomComs/AtomLine';

/** 根据 type 静态注册组件对象 */
const Elements: ElementCenter = {
  button: AtomButton,
  line: AtomLine,
  table: AtomTable,
};

export default function Stage() {
  const { rootIds, stageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => {
      return {
        stageComponentsModel: model.stageComponentsModel,
        rootIds: model.rootIds,
      };
    },
  );

  const rootNodeModels = useMemo(() => {
    return rootIds
      .map((id) => stageComponentsModel?.[id])
      .filter((item): item is StageComponentsModelItem => item !== undefined);
  }, [rootIds, stageComponentsModel]);

  if (!rootNodeModels) {
    return null;
  }

  consola.info('渲染跟节点组件', rootIds, stageComponentsModel);

  return (
    <div>
      <ElementsCxt.Provider value={Elements}>
        {rootNodeModels.map((model) => (
          <Atom key={model?.id} {...model} />
        ))}
      </ElementsCxt.Provider>
    </div>
  );
}
