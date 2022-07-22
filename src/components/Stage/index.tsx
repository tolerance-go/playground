import { Atom } from '@/components/Atom';
import { AtomButton } from '@/components/AtomButton';
import { ElementsCxt } from '@/components/ElementsCtx';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { ElementCenter } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useMemo } from 'react';
import { AtomLine } from '../AtomLine';

/** 根据 type 静态注册组件对象 */
const Elements: ElementCenter = {
  button: AtomButton,
  line: AtomLine,
};

export default function Stage() {
  const { rootIds, stageComponentsModel } = useModel(
    'stageComponentsModel',
    (model) => {
      debugger;
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

  consola.info('渲染跟节点组件');

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
