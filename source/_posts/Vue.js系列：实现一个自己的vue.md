---
title: Vue.js系列：实现一个自己的vue
date: 2023-08-09 09:54:37
category: 前端剑宗专栏
tags:
---

**本文开始，我们尝试着实现一个自个儿的vue框架（简陋版本）。**
#### 基本功能
`数据变化，更新视图，视图变化，改变数据。(MVVM中的VM做的事情)`

1. 首先我们的页面结构如下：
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My_vue</title>
</head>
<body>
    <div id="app">
        <input type="text" v-model="msg">
        <div>{{msg}}---{{info}}</div>
    </div>
</body>
<script>
    const mv = new MyVue({
        el: '#app',
        data: {
            msg: 'hello',
            info: 'world'
        }
    })

</script>
</html>
```

照葫芦画瓢，通过script标签引入我们的Myvue文件，然后在底部实例化mv。入参的名称参考vue。
样子有了，具体页面呢？
具体页面长这样：
<img src="/img/vue_basic_1.jpg" alt="主页面结构" width="500">

其中输入框通过v-model绑定变量msg，另一个文本绑定了info。可为什么原样显示呢？废话，应为我们还啥都没做。目前的Myvue代码如下：
```html
<script src="./Compile.js"></script>
```

```javascript
class MyVue {
    constructor(vm) {
        this.vm = vm
        this.$data = vm.data
        this.$el = document.querySelector(vm.el)
        // new Compile(this)
    }
}
```
**Myvue就是一个class类，其中拥有三个属性，vm，当前myvue的实例，更直白的将就是描述当前组件的那个入参对象；$data: 设置的各个变量；$el: 绑定的div的dom节点，就是大容器app。**

至此，我们有了基本的页面结构，和最最基础的myvue类，接下来正式开始我们的需求。

#### 数据劫持
Obsever。将数据变成响应式的数据，就是get和set时我们能够知道
```javascript
<script src="./Myvue.js"></script>
<script src="./Obsever.js"></script>
```
```javascript
class MyVue {
    constructor(vm) {
        ...
        ...
        new Obsever(this)
        ...
        ...

}
class Obsever {
    constructor(vm) {
        this.vm = vm
        this.data = vm.$data
        this.obsever()
    }
    obsever() {
        // const dep = new Dep()
        for (let key in this.data) {
            let val = this.data[key]
            Object.defineProperty(this.data, key, {
                enumerable: true,
                get() {
                    // Dep.target && dep.addSub(Dep.target)
                    console.log('搜集依赖')
                    return val
                },
                set(newVal) {
                    console.log('触发依赖')
                    val = newVal
                    // dep.notify()
                }
            })
        }
    }
}
```
从代码中可知， 我们在Obsever类中，存储了vm和data，然后触发`obsever`函数。他做的事情很清晰，通过`Object.defineProperty`api自定义了一下`set和get`内部做的事情。就是说此刻，对于存储在data中的变量，对他们的使用及改变的`时机`，我们都能够捕捉到。

<img src="/img/vuejs_observe.gif" alt="">

**从图中能够看到，当我们访问或者改变变量时，均捕捉到了其变化**

#### 编译模板:Compiler
对模板代码解析编译，找到其中动态绑定的数据，从data中获取更新视图。
Compile也是一个类。入参为当前的实例对象mv。具体代码如下：
```html
<script src="./Compile.js"></script>
```
```javascript
// Myvue.js中新增
new Compile(this)

```

```javascript
//  什么叫编译模板--->把template变成dom，如{{变量}}--->真实的数据

class Compile {
    constructor(vm) {
        this.vm = vm
        this.el = vm.$el
        const fragment = this.nodeToFragment()
        this.compile(fragment)
        this.vm.$el.appendChild(fragment)
        // console.log('f', fragment)
        // 编译文档片段，解析{{}}
    }
    // 解析出{{}},变量赋值
    compile(fragment) {
        const nList = fragment.childNodes
        nList.forEach((node) => {
            const nType = node.nodeType
            if (nType === 3) {
                this.compileText(node)
                // 解析文本
            } else if (nType === 1) {
                this.compileElement(node)
                // 元素节点
            }
            if (node.childNodes && node.childNodes !== 0) {
                this.compile(node)
            }
        })
    }
    compileElement(node) {
        const attrs = node.attributes
        if (!!attrs.length) {
            const attrsArr = Array.from(attrs)
            attrsArr.forEach((att) => {
                if(att.nodeName === 'v-model') {
                    const val = att.value
                    node.value = this.vm.$data[val]
                }
            })
        }
    }
    compileText(node) {
        const con = node.textContent
        const reg = /\{\{(.+?)\}\}/g
        if(reg.test(con)) {
            console.log(node)
            const newVal = con.replace(reg, (...arg) => {
                return this.vm.$data[arg[1]]
            })
            node.textContent = newVal
        }
    }
    nodeToFragment() {
        const f = document.createDocumentFragment()
        while(this.el.firstChild) {
            f.appendChild(this.el.firstChild)
        }
        return f
    }
}
```
总体逻辑：**根据当前vm的$el, 创建一个`fragment`, 编译之，然后appendChild回真实dom，完成编译。**
- 1. **nodeToFragment做了啥？**
```javascript
    nodeToFragment() {
        const f = document.createDocumentFragment()
        while(this.el.firstChild) {
            f.appendChild(this.el.firstChild)
        }
        return f
    }
```
创建了一个文档片段，然后`自毁式遍历`当前的el的儿子元素，依次添加到了`文档片段f`中。这里需要解释的一点是，当我们将el.firstChild添加到f中后，el的firstChild会变成之前的第二个，以此类推所以称之为自毁。但是呢，dom被添加到f中后，此时页面只会少不会增。可以理解为我们暂时性的找了个盒子，专门用来存放这些真实的dom。所以nodeToFragment函数的作用，就是把所有的真实儿子节点给到了文档片段f。然后以其作为输入，调用`compile`。

- 2. **compile干了啥？找出所有的data中的变量**
```javascript
    // 解析出{{}},变量赋值
    compile(fragment) {
        const nList = fragment.childNodes
        nList.forEach((node) => {
            const nType = node.nodeType
            if (nType === 3) {
                this.compileText(node)
                // 解析文本
            } else if (nType === 1) {
                this.compileElement(node)
                // 元素节点
                
            }
            if (node.childNodes && node.childNodes !== 0) {
                this.compile(node)
            }
        })
    }
```
该函数就是一个中转函数，然后交给对应的编译节点函数处理。遍历所有的子节点，然后根据nodeType分别处理。nodeType时节点的类型字段，比如，3就是文本text，1就是元素如div。

**对于文本节点的处理：**
```javascript
    compileText(node) {
        const con = node.textContent
        const reg = /\{\{(.+?)\}\}/g
        if(reg.test(con)) {
            console.log(node)
            const newVal = con.replace(reg, (...arg) => {
                return this.vm.$data[arg[1].trim()]
            })
            node.textContent = newVal
        }
    }
```
通过textContent属性，获取文本节点的具体内容，然后通过正则匹配双括号的规则，匹配出变量如{{msg}}、{{info}}等。再根据vm.$data中对应的变量值，覆盖文本节点的textContent 。**至此完成文本节点的变量--->值的页面赋值。**

**对于元素节点的处理：**
```javascript
    compileElement(node) {
        const attrs = node.attributes
        if (!!attrs.length) {
            const attrsArr = Array.from(attrs)
            attrsArr.forEach((att) => {
                if(att.nodeName === 'v-model') {
                    const val = att.value
                    node.value = this.vm.$data[val]
                }
            })
        }
    }
```
对元素节点的解析是为了处理像`v-model`这样的自定应属性。通过attributes属性获取该元素的所有属性。找到v-model对应的变量名，然后改写node.value.`完成元素节点的变量--->值的页面赋值。`

- 3. **将文档片段直接塞入容器dom---el。更新页面中的所有绑定变量数据，完成模板解析。**
```javascript
this.vm.$el.appendChild(fragment)
```
<img src="/img/vue_basic_2.png" alt="插入文档片段，完成编译">

至此，我们完成了第二步：**模板解析**.

**但是此时，当我们尝试改变数据时，视图并没有更新，改变视图时，数据也并没有更新。**

<img src="/img/vue_basic_3.gif" alt="" >

没反应，属正常现象。因为我们还没做完。

简单捋一下： 目前已经通过`Observer`把数据变成响应式的了，然后`Compiler`完成了模板编译。接下来要做的事情就很清晰了：
- `改变数据时，重新编译模板`
- `改变视图数据时，更新数据。`

#### Watcher和Dep登场

首先注意一个细节，现阶段代码情况下，打开控制台发现了如下打印：
<img src="/img/vue_basic_4.png" alt="" >

发现控制台显示了三个`搜集依赖`, 为什么？`因为当我们解析模板时，取了data中的三次变量去赋值dom内容了对吧。也就是说，在模板解析阶段，凡是用到了变量的地儿，都能够触发对应变量的get。`那么如果解析时触发get存储一个回调函数（再执行一遍编译的操作），然后当我们改变变量值的的时候，调用一下回调不就实现data-->视图的更新了吗？

改写编译函数：
```javascript
    compileText(node) {
        const con = node.textContent
        const reg = /\{\{(.+?)\}\}/g
        if(reg.test(con)) {
            const newVal = con.replace(reg, (...arg) => {
                // arg[1]就是data中的变量名，此处为msg、info
                new Watcher(this.vm, arg[1].trim(), () => {
                    const xx = con.replace(reg, (...arg) => {
                        return this.vm.$data[arg[1].trim()]
                     })
                    node.textContent = xx
                })
                return this.vm.$data[arg[1].trim()]
            })
            node.textContent = newVal
        }
    }
```
`watcher类如下：`
```javascript
<script src="./Watcher.js"></script>
...
...
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.cb = cb
        this.oldVaL = this.getOldVal(key, vm)
    }
    getOldVal(key, vm) {
        Dep.target = this
        const oldVal = compileUtil.getValue(key, vm)
        Dep.target = null
        return oldVal
    }
    update() {
        this.cb()
    }
}
```
注意页面中会有很多个watcher，所以我们另外准备了一个仓库Dep类的实例来统一管理这些watcher，实际就是一个数组。

```javascript
<script src="./Dep.js"></script>
...
...

class Dep{
    constructor() {
        this.subList = []
    }
    addSub(watcher) {
        console.log(watcher)
        this.subList.push(watcher)
    }
    notify() {
        console.log('当前的总wacther>>>', this.subList)
        this.subList.forEach((sub) => {
            sub.update()
        })
    }
}
```

在编译模板时，注册一个Watcher类的实例，该实例初始化时会自动触发目标变量的get，在get中, 将当前的实例watcher添加到仓库中。那么下次改变数据的时候，会执行notify操作，该操作会遍历所有仓库中的watcher，执行`update`,也就是回调函数重新编译视图。

```javascript
    obsever() {
        const dep = new Dep()
        for (let key in this.data) {
            let val = this.data[key]
            Object.defineProperty(this.data, key, {
                enumerable: true,
                get() {
                    Dep.target && dep.addSub(Dep.target)
                    console.log('搜集依赖')
                    return val
                },
                set(newVal) {
                    console.log('触发依赖')
                    val = newVal
                    dep.notify()
                }
            })
        }
    }
```

<img src="/img/vue_basic_5.gif" alt="" >

注释：前端领域的**编译**和我们传统的计算机专业内定义的**编译**有些不同，但是内核精神是一致的。写过c或者java都知道，我们写的程序是一套代码，但是这套代码机器无法直接运行，因为机器只能执行二进制，此处概念的理解可以去看看《编码》这本书，他会告诉你，**cpu的本质，实际就是继电器。**回过头来，因为机器看不懂我们人类世界的代码，所以需要**编译器**这个中介，将我们写的这一套代码，转换成机器能够执行的二进制代码。而前端领域中的**模板编译**，指的是`将如上图中，页面绑定的各个变量，转换成其真实的值`。顺带提一句，webpack中的各种loader也可以看成是各种编译器，如babel-loader，因为浏览器看不懂es6及其之后版本的js代码，那么babel-loader的作用就是转换之。但是总的来说，本质的精神内核是一致的：**转码**。

**总结时刻**：
1. vue初始化的时候，首先会observe，将data中的数据变成响应式数据
2. 然后compile模板，将模板中用到的变量，替换成具体的值，同时会注册watcher
3. 当变量改变，会调用dep中的wacther，执行回调，更新视图


