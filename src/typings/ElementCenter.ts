/**
 * 舞台渲染组件需要的接口类型
 */
export type AtomComponentProps<
  Settings extends object = object,
  Styles extends object = object,
> = {
  /** 插槽存在多种，不单单是 children */
  slots?: Record<string, string[]>;
  settings?: Settings;
  id: string;
  statId: string;
  styles?: Styles;
};

/**
 * 组件类型注册中心
 */
export type ElementCenter = Record<
  string,
  React.ElementType<AtomComponentProps>
>;
