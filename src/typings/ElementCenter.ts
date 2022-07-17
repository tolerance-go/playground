/**
 * 舞台渲染组件需要的接口类型
 */
export type AtomComponentProps<Settings extends object = object> = {
  /** 插槽存在多种，不单单是 children */
  slots?: Record<string, string[]>;
  /** 从小到大排序 0,1,2 */
  slotsOrder?: Record<string, number[]>;
  settings: Settings;
  id: string;
};

/**
 * 组件类型注册中心
 */
export type ElementCenter = Record<
  string,
  React.ElementType<AtomComponentProps>
>;
