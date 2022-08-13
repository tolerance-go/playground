import { Atom } from '@/components/Atom';
import { AtomButton } from '@/components/atomComs/AtomButton';
import { ElementsCxt } from '@/components/ElementsCtx';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { ElementCenter } from '@/typings/ElementCenter';
import { joinUnitNumber } from '@/utils/joinUnitNumber';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useMemo } from 'react';
import { AtomLine } from '../atomComs/AtomLine';
import { AtomTable } from '../atomComs/AtomTable';

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

  const { stageSize } = useModel('stageSize', (model) => ({
    stageSize: model.stageSize,
  }));

  if (!rootNodeModels) {
    return null;
  }

  consola.info('渲染跟节点组件', rootIds, stageComponentsModel);

  return (
    <div
      id="stage"
      style={{
        width: joinUnitNumber(stageSize?.width),
        height: joinUnitNumber(stageSize?.height),
        background: '#fff',
      }}
    >
      <ElementsCxt.Provider value={Elements}>
        {rootNodeModels.map((model) => (
          <Atom key={model?.id} {...model} />
        ))}
      </ElementsCxt.Provider>
    </div>
  );
}
