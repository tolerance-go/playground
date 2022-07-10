import { Atom } from '@/components/Atom';
import { AtomButton } from '@/components/AtomButton';
import { ElementsCxt } from '@/components/ElementsCtx';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { ElementCenter } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import consola from 'consola';

/** 根据 type 静态注册组件对象 */
const Elements: ElementCenter = {
  button: AtomButton,
};

export default function App() {
  const { rootNodeModels } = useModel('stageComponentsModel', (model) => ({
    rootNodeModels: model.rootIds
      .map((id) => model.stageComponentsModel?.[id])
      .filter((item): item is StageComponentsModelItem => item !== undefined),
  }));

  if (!rootNodeModels) {
    return null;
  }

  consola.info('渲染跟节点组件');

  return (
    <ElementsCxt.Provider value={Elements}>
      {rootNodeModels.map((model) => (
        <Atom key={model.id} {...model} />
      ))}
    </ElementsCxt.Provider>
  );
}
