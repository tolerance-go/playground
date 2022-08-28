import { Atom } from '@/components/Atom';
import { AtomButton } from '@/components/atomComs/AtomButton';
import { ElementsCxt } from '@/components/ElementsCtx';
import { ComponentStructure } from '@/models/page/comsStructures';
import { ElementCenter } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useMemo } from 'react';
import { AtomLine } from '../atomComs/AtomLine';
import { AtomTable } from '../atomComs/AtomTable';
import { StagePlaygroundWrapper } from './wrappers/Playground';
import { StageWorkbenchWrapper } from './wrappers/Workbench';

/** 根据 type 静态注册组件对象 */
const Elements: ElementCenter = {
  button: AtomButton,
  line: AtomLine,
  table: AtomTable,
};

export default function Stage() {
  const { rootIds, stageComponentsModel } = useModel(
    'page.comsStructures',
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
      .filter((item): item is ComponentStructure => item !== undefined);
  }, [rootIds, stageComponentsModel]);

  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));

  if (!rootNodeModels) {
    return null;
  }

  consola.info('渲染跟节点组件', rootIds, stageComponentsModel);

  const el = (
    <ElementsCxt.Provider value={Elements}>
      {rootNodeModels.map((model) => (
        <Atom key={model?.id} {...model} />
      ))}
    </ElementsCxt.Provider>
  );

  if (stageMode === 'playground') {
    return <StagePlaygroundWrapper id="stage">{el}</StagePlaygroundWrapper>;
  }

  return <StageWorkbenchWrapper id="stage">{el}</StageWorkbenchWrapper>;
}
