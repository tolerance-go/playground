# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://next.umijs.org/zh-CN/docs/max/introduce)

# 增加一个新组件

## 1. 新增点击入口

> 注意 name 的添加

src/pages/Workbench/SiderLeft/ComponentGrid/useGridData.ts

## 2. 增加点击逻辑

src/pages/Workbench/SiderLeft/ComponentGrid/useHandleComGridItemClick.ts

## 3. 增加组件配置面板和默认配置数据

src/models/comsSettingsConfigs.ts

## 4. 增加组件 key 和 element 的映射

src/components/Stage/index.tsx

## 5. 设计新增 Atom 组件

src/components/atomComs

# 增加一个新的输入控件 ConfigsForm

## 1. 设计新增输入控件组件

src/components/ConfigsForm/inputs

可选

## 2. 修改映射类型

src/typings/SettingFormConfig.ts

## 3. 添加 type 和新组件的映射

src/components/ConfigsForm/ConfigInput.tsx

如果是 proForm 系列组件需要在 formItem 处拦截

src/components/ConfigsForm/ConfigFormItem.tsx

## 4. 设置样式配置项

src/models/comsStyleConfigs.ts

## 5. 添加新的动作类型

src/models/comsActionsConfigs.ts

## 6. 添加新的事件类型

src/models/comsEventsConfigs.ts

## 7. 添加插槽类型

src/models/componentsSlots.ts

## 最佳实践

1. 一般视图层 事件回调的地方，最好只 set 很少的状态，考虑用 effect 进行关联，如果一个事件处理函数中，出现了很多 set 就需要额外注意是不是设计上存在缺陷，如果 set 应只保留当前操作最相关的部分

> 注意同时参考第二条信息

```
 onClose={() => {
        setDetailVisible(false);
      }}
```

2. effect 属性间的联动，不要滥用，属于优化操作

避免沉重的心智负担

一般我们在事件发生的地方进行状态处理就够了

只有重复出现的，明确的事件处理逻辑中出现的状态关联，可以优化为 effect

万一出现过度关联（非预期的联动），我们需要加判断条件及注释

3. update 在什么时候同步后端是个经验问题

之前我的设想是 update 都是先同步 state，再请求接口，而不是先请求接口，成功后再同步 state

这样当用户操作后，可以先立即响应，而不是等待网络返回

这样是挺好的，但是不是都适用，它主要适用在“编辑器”领域，编辑是没有确认环节操作的；如果**有明确的更新确认操作**，先发送请求可能更加稳定好用
