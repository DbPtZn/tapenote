### 2023/6/28
1. 在逻辑中，当鼠标进入控件时， draggable 设置为 true, 允许页面拖拽。鼠标离开控件时， draggable 设置为 false, 关闭页面拖拽。此前只在离开控件时关闭 draggable， 这导致 drop 之后， draggable 仍然处于 true 。 优化之后，在拖拽结束后以及 drop 后都会将draggable 设置为 false。
2. 在此前的逻辑中，对拖拽只设置了阻止冒泡 @dragstart.stop，这导致在容器内部的实例发生拖拽事件时，也触发了 @dragstart。 优化之后： @dragstart.stop.self， 只触发当前元素。
3. 以上两个 bug 导致了首次使用容器内部的拖拽删除逻辑之后，其它容器中出现拖拽时也会显示出粉碎机（Shredder）控件。

### 2023.6.30
1. 尝试优化递归查询方法失败，看来对递归的理解不太够。有时间再研究。
2. 此前创建容器的方法忘记设置容器类型，已补上。
3. 拖拽至碎纸机移除容器后没有抛出 onContainerRemove 事件，已补上。
4. 新增节点control控件渲染函数，至此有三种方式使用控件：
   a. 默认
   b. 通过 props 传入渲染函数
   c. 通过配置中的 renderControl 配置项传入渲染函数
   优先级： c > b > a
  不论何种，要使用时配置项中的 useControl 都要设置成 true

### 2023.9.6
1. 使用固定px设置 radio（比例）时，没有考虑body的实际尺寸会导致的问题。因为我们在实际计算中是将 px 换算成百分比进行计算的。如果我们期望在一个超过或低于屏幕宽度的body中使用分形容器，会发现设置的 px 值最终结果可能不是我们期望的固定值，而是随着容器实际大小改变的。而我们期望它是一个固定值。
2. 我在 FractalContainer 组件中的分形组件外套一层div，使用这层div设置分形容器的整体高度，并为这个div设置一个比较特殊的id属性用于dom查询。这样在 useAllocateSize 函数中就可以查询到这个div并获取其宽高。（这个宽高取代了原有的window.innerHeight/width）
3. 为什么要使用 dom 查询？不能直接传值吗？因为从外部传进来的宽高是设置整体宽高，但这个整体宽高可能收到浏览器窗口缩放的影响，所以是会发生变化的，因此不能使用传值，而是要获取浏览器的实际宽高进行计算。

### 2023.9.12
1. 在 renderStore 中新增 implementRef 参数用于实例化分形容器之后存放实现层节点
2. 该实现层节点可能会用于控制页面的滚动，考虑到直接使用 dom 查询可能会存在安全性问题，因此在这里使用了 store 来记录该元素
3. 在 renderStore 中新增 wrapperRef 参数用于实例化分形容器之后存放封装层节点
4. 该封装层节点可能会用于获取分形容器的整体宽高属性

### 2023.11.2
workbench.ts:92 [Vue warn]: Unhandled error during execution of scheduler flush. This is likely a Vue internals bug.
当出现以上错误的时候，很可能是视图组件中某个方法出错。


### 2023.11.4
1. 使用富文本编辑器的时候，组件不可以允许拖拽，否则光标无法聚焦到编辑器内，所以要对组件的拖拽进行限制，当作为 cmpt 渲染的时候，当且仅当指针进入拖拽控件之后才开启组件拖拽允许，移出时禁止拖拽。
2. 出现组件移除后，数据仍未移除的情况。（在多次移动组件后出现该情况，暂时无法定位bug形成的原因）。可能是移除占位的空节点时出了问题。(移入左右侧时，不知原因导致根节点的data和工作区的data脱离联系)。。。发现问题了，因为不知原因将工作区的wrapper封装层给移除了。
问题解决：是 checkSimpleNodeAndClean 出了问题，并没有进行约束，导致 wrapper 层被错误移除。 新增约束：仅 simple 层会被清理。
3. 插入节点时，如果触发创建 simple 容器改动排列时，会导致旧节点渲染失败。（原因不知。）
报错信息[Vue warn]: Component is missing template or render function. （疑似渲染模板的信息丢失）
问题暂时解决： 直接重新创建旧节点数据，
const oldNode = {
  id:  node.id,
  name: node.name,
  type: 'component',
  isRow: true,
  allowDrag: true,
  allowDrop: true,
  useControl: true,
  url: undefined,
  cmpt: node.cmpt,
  children: []
}
而不是 const oldNode = JSON.parse(stringify(node))。
不能使用 JSON.parse(stringify(node)) 方法不行的原因未知，可能是已渲染的 vnode 包含某些信息导致其无法再次被渲染。
进一步测试发现，可以使用 const oldNode = JSON.parse(stringify(node)) 搭配 oldNode.cmpt = node.cmpt。 
综上推测可能是 vue 组件在序列化之后出现信息丢失，这层丢失的信息在一般情况下不会出现问题，但在所处的 vdom 树结构发生变化时，会因为信息丢失导致组件渲染失败。
总结： 有些问题只用 iframe 是无法发现的，尤其是涉及到 vue 组件变化的时候。



### 2023.11.5
总结一些可以优化的点：
1. 关于各种容器类型的规范、命名（比如有 compoent 容器，但 wrapper 容器也不限制使用 cmpt 渲染，这就有可能产生混淆，应该理清各个类型的容器以及分别对它们做了哪些限制）
2. 采用 cmpt 组件渲染时，对组件的序列化和反序列化是个问题，暂无解决方案。
3. 在代码方面，对 iframe 渲染和 cmpt 渲染的一致性未进行充足的测试和论证。
4. 代码的优化、抽离。


### 2024.4.1
1. 二级嵌入容器，一级容器尺寸的改变并没有引发二级容器更新其内部容器的尺寸比例。通过统一的 window 窗口变化监听会触发所有级别容器检查尺寸比例并更新。也就是说，除了窗口变化的监听，目前容器的外部容器变化并不能引起容器尺寸更新（可能不间隔很多层引起的尺寸变化）。所以是否要在容器内监听整个容器的尺寸变化，如何监听？这种因外部容器尺寸变化而导致的变化可以在容器内部监听到吗？ 很可能不行。
2. 换个思路，我们能否将容器尺寸变化广播出去，让所有容器重新计算尺寸？（待解决）
3. 解决：添加一个 resizing props 属性，在父容器尺寸发生变化时将变化值传递给 resizing，容器内通过监听 resizing 值变化来触发更新重新分配大小。

### 2024.8.12
1. 添加一个 key 参数（可选），用于实现特定组件的刷新重载