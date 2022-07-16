import { Atom } from '@/components/Atom';
import { AtomButton } from '@/components/AtomButton';
import { ElementsCxt } from '@/components/ElementsCtx';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import { ElementCenter } from '@/typings/ElementCenter';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useEffect } from 'react';
import { AtomLine } from '../AtomLine';

/** 根据 type 静态注册组件对象 */
const Elements: ElementCenter = {
  button: AtomButton,
  line: AtomLine,
};

export default function Stage() {
  const { rootNodeModels } = useModel('stageComponentsModel', (model) => ({
    rootNodeModels: model.rootIds
      .map((id) => model.stageComponentsModel?.[id])
      .filter((item): item is StageComponentsModelItem => item !== undefined),
  }));

  useEffect(() => {
    consola.info('初始化舞台基本信息');
  }, []);

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
