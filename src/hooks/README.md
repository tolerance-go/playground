一般使用多个 model 之间数据，或者复用状态&逻辑，或者是全局做一件事或者是独立维护状态，方便管理

解决 model 间的循环依赖

- 用名字表示这是谁的 effect

或者是通过 id memo 一个数据返回

- eg: useStageSelectSlotGroup

# 设计

1. hooks 文件组织

分类方法是，按照特征，而不是具体对象
