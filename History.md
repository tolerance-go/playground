# 罗列应对场景

1. 先同步后端，再修改前端状态（CRD）
2. 先修改状态，再同步后端（U）
3. 纯前端状态

关于恢复：

第一种情况，恢复也是要先同步后端，这个逻辑不变

第二种情况，恢复后，同步后端一般是视图层的监听行为

## 基本设计

首先需要一个 数组 表示快照 栈，它用来存放所有“快照“信息 --- snapshotsStack

我们将 快照 碎片化进行管理，分成很多 area （区域）--- areas

快照链的顶部 +1，我们称为 commit，commit 的过程大致是：

1. 快照管理器向所有内部 areas 要数据，这个方法叫做 pull

area 根据 pull 返回的数据可以在将来进行 recover（恢复）

2. 快照管理器把向 areas 拿到的数据进行整合，插入到数组尾部

## 和组件的关联方式

组件可以通过快照管理器的 listen 方法，监听快照的变化

1. 当快照加载完毕，应该拿到顶部数据，通知所有 areas 进行 recover 一次，让一些不做持久化的状态，从初始化状态进入最近一次快照状态，比如 modal 的 visible

2. 当快照回退，也应该通知 areas 进行 recover

### 快照后退的场景

用 index 标示栈的位置，默认一直指向顶部

当快照后退，则相应修改 index 位置

#### 异步的 recover

对于整体而言，状态的恢复是可以快速执行，并跳过某几个 commit，直接恢复到指定 commit 快照

但是我们放弃上面的方案，我们希望每次快照都体现在界面中一次，让用户可以感知到

但是 area 的 recover 有异步性，所以快照管理器的 revert 方法也是异步的，目前无法取消，只能无限增加，也就是当用户快照回撤了 3 次（键盘操作了 3 次），那么会执行一个异步链条：3-2-1，最终定格在 1 的快照状态上，并且期间应该是无法进行操作的，如果这个 loading 的时间很慢，为了防止此时用户继续 commit 新的快照，快照管理器提供了一个 isReverting 和 listen：reverting 的方法来让组件进行判断

#### recover 失败后

一次 commit revert 就表示多个 areas 进行 recover

所有 areas recover 成功，则代表该 revert 成功

但是其中一个 recover 失败，那么该 revert 失败，~~并且已经成功的 recover 需要 back 回去~~

~~revert 是串行异步的，当一个 revert 失败后，剩下的队列中等待的项目**全部丢弃**~~

此时 revert 进入半成功状态，并提示用户，commit 不进行移动，下一次 revert 的进行时，从上次失败的 recover 开始进行

### commit 时，如果 index 不在顶部

commit 时，如果 index 不在顶部，将新增的 commit 作为 head，丢弃掉之前所有的 commit

### 异步注册 area 的情况

异步初始化，触发 inited 事件后，需要将历史记录所在记录状态，同步到最新 app 状态

但是要等全部 area 注册完毕后（area 注册可能是异步进行的），因此 HistoryManager 创建的时候，需要给定 areas 可能的范围

### 记录

1. commit 应该在和后端同步成功后进行

拿 dataList 举例：

项目中，create，delete，search 都是在同步修改视图 state 的地方进行 commit，因为有个默认前提是，这些操作之前已经先同步过了后台接口

update 因为属于后置响应式的和后端同步的数据，commit 在其接口调用成功的后面执行

2. commit 的时机可以是 effect 也可以是 fn

我们为了区分是 recover 触发的状态更新还是交互触发的，所以在用 effect 的时候，需要配置 ref 标记

所以一般除了不得不用 effect 的时候，比如 update，其他情况都是用 fn 更易读

3. 最好不要直接暴露 setXXX 方法

太底层，也不容易做拦截处理
