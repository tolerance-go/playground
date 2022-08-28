import { ElementsCxt } from '@/components/ElementsCtx';
import { useComActiveStatSetting } from '@/hooks/useComActiveStatSetting';
import { useComActiveStatStyle } from '@/hooks/useComActiveStatStyle';
import { useComDefaultStatId } from '@/hooks/useComDefaultStatId';
import { useComDefaultStatSetting } from '@/hooks/useComDefaultStatSetting';
import { useComDefaultStatStyle } from '@/hooks/useComDefaultStatStyle';
import { useComponentUsedSettings } from '@/hooks/useComponentUsedSettings';
import { ComponentStructure } from '@/models/page/comsStructures';
import { useModel } from '@umijs/max';
import consola from 'consola';
import { useContext } from 'react';
import { AtomPlaygroundWrapper } from './wrappers/Playground';
import { AtomWorkbenchWrapper } from './wrappers/Workbench';

/**
 * 通过 model 生成组件
 * 舞台上的组件
 */
export const Atom = (props: ComponentStructure) => {
  const { stageMode } = useModel('stage.stageMode', (model) => ({
    stageMode: model.stageMode,
  }));

  const elements = useContext(ElementsCxt);

  const Element = elements[props.type];
  const { slots } = props;

  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model.stageSelectNodeId,
  }));

  const { defaultStatId } = useComDefaultStatId(props.id);
  const { settings: defaultSettings } = useComDefaultStatSetting(props.id);
  const { styles: defaultStyles } = useComDefaultStatStyle(props.id);
  const {
    settings: usedSettings,
    styles: usedStyles,
    usedStatId,
  } = useComponentUsedSettings(props.id);
  const { settings: activeStatSettings } = useComActiveStatSetting(props.id);
  const { styles: activeStatStyles } = useComActiveStatStyle(props.id);

  consola.info('渲染 atom 组件', props.id);

  const statId = (usedStatId ?? defaultStatId) as string;

  /**
   * 选中状态 settings 优先级最高
   * 其他 used 大于 defaults
   */
  const el = (
    <Element
      key={props.id}
      {...{
        id: props.id,
        /** 每个组件都一定存在一个默认状态 */
        statId,
        settings:
          stageSelectNodeId === props.id
            ? activeStatSettings ?? usedSettings ?? defaultSettings
            : usedSettings ?? defaultSettings,
        styles:
          stageSelectNodeId === props.id
            ? activeStatStyles ?? usedStyles ?? defaultStyles
            : usedStyles ?? defaultStyles,
        slots,
      }}
    />
  );

  if (stageMode === 'playground') {
    return (
      <AtomPlaygroundWrapper
        statId={statId}
        comId={props.id}
        display={props.display}
      >
        {el}
      </AtomPlaygroundWrapper>
    );
  }

  return (
    <AtomWorkbenchWrapper
      {...props}
      usedStat={usedStatId !== undefined && usedStatId !== defaultStatId}
    >
      {el}
    </AtomWorkbenchWrapper>
  );
};
