---
title: React系列：第三回(状态管理)
date: 2024-03-09 21:44:24
category: React系列

---


#### 本文见到那介绍下React中的状态管理
适配react的状态库很多，本文涉及三个： `Zustand`、`Redux` 和 `Context`
#### Zustand

```javascript
// npm install zustand

// 2. 创建store
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,
  // 同步更新
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  // 异步更新（内置支持，无需中间件）
  incrementAsync: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({ count: state.count + 1 }));
        resolve();
      }, 1000);
    });
  }
}));

// 3. 组件中直接使用（无需Provider）
function Counter() {
  // 方式1：选择单个状态（自动订阅更新）
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  
  // 方式2：批量选择（减少重渲染）
  // const { count, increment, decrement } = useCounterStore(
  //   (state) => ({ count: state.count, increment: state.increment, decrement: state.decrement }),
  //   { shallow: true } // 浅比较，避免不必要的重渲染
  // );

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={() => useCounterStore.getState().decrement()}>-</button>
      <button onClick={() => useCounterStore.getState().incrementAsync()}>+（异步）</button>
    </div>
  );
}
```




#### Redux

```javascript
// 安装
cnpm install @reduxjs/toolkit react-redux
```
##### 基本使用
redux是一个状态管理容器，类似vuex，几个重要的角色： `store（数据源）、action及reducer（负责修改数据）`。下面代码演示他的基本使用：
```javascript
// index.js中引入redux的store和provider方法
import store from './store'
import { Provider } from 'react-redux'
...
...
<Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
</Provider>


// store的index
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './mouduls/counterStoreA'

const store = configureStore({
    reducer: {
        counter: counterReducer,
    }
})

export default store

// counterReducer文件
import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const counterStore = createSlice({
    name: 'counter',
    initialState: {
        count: 0
    },
    reducers: {
        increment(state, value) {
            state.count = state.count + value.payload
        },
        decrement(state, value) {
            state.count = state.count - value.payload
        }
    }
})

const { increment, decrement } = counterStore.actions
const reducer = counterStore.reducer

export { increment, decrement}
export default reducer
```

**至此，我们创建了一个redux中的变量count，下面在组件中使用。**

```javascript
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment } from '../../store/mouduls/counterStoreA';
...
...
const HomeComponent = () => {
  const { count } = useSelector((state: any) => state.counter)
  const dispatch = useDispatch()

  console.log('count:', count)
  return (
      <div>
          <div>我是HomeComponent...</div>
          <Button onClick={() => dispatch(decrement(10))}>减减</Button>
          <Button onClick={() => dispatch(increment(10))}>加加</Button>
          <span>{count}</span>
      </div>
  )
}
```
通过`useSelector`获取变量，通过`useDispatch`提交修改，效果如下：
<img src="/img/reactredux1.gif" alt="">

##### 异步获取更新值

通过异步请求拿到数据，更新store中的变量。

```javascript
// 异步请求
// store/counterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInfo } from "@/server/testpageAPI";

export const fetchCounterAsync: any = createAsyncThunk(
  "counter/fetchCounter",
  async () => {
    const response = await getInfo();
    return await response;
  }
);

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    status: "idle"
  },
  reducers: {
    increment: (state, action) => {
      state.value = action.payload; // 同步操作
    },
    decrement: (state, action) => {
      state.value = action.payload; // 同步操作
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCounterAsync.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchCounterAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload.data.word;
      })
      .addCase(fetchCounterAsync.rejected, state => {
        state.status = "failed";
      });
  }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;


// store/index文件
import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});


// 组件中使用
export const SiderComponent = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state: any) => state.counter.value);
  const status = useSelector((state: any) => state.counter.status);
  return (
    <div className="w-full h-full ">
      <div className="w-full">
        {counter}
      </div>
      <div className="w-full">
        {status}
      </div>
      <ButtonCommon
        className="w-full"
        type={EButtonType.SIMPLE}
        onClick={() => {
          const newVal = counter + 1;
          dispatch(increment(newVal));
        }}
      >
        <span className="">+</span>
      </ButtonCommon>
      <ButtonCommon
        className="w-full"
        type={EButtonType.SIMPLE}
        onClick={() => {
          const newVal = counter - 1;
          dispatch(decrement(newVal));
        }}
      >
        <span className="">-</span>
      </ButtonCommon>
      <ButtonCommon
        className="w-full"
        type={EButtonType.SIMPLE}
        onClick={() => {
          dispatch(fetchCounterAsync());
        }}
      >
        <span className="">异步</span>
      </ButtonCommon>
    </div>
  );
};


```

##### 总结一下

` action --> dispatcher ---> store ---> view`, 同vuex如出一辙


#### Content provider
##### 没啥说的，直接上代码

```jsx
// 定义一个context文件，暴露组件及context
import { createContext, useEffect, useState } from "react"; 
interface ColorContext {
  color: any;
  setColor: React.Dispatch<React.SetStateAction<any>>;
}

export const ColorContext = createContext({} as ColorContext);
export default function ColorProvider(props: any) {
  const [color, setColor] = useState("#000000");
  useEffect(
    () => {
      console.log("color>>>", color);
    },
    [color]
  );
  return (
    <ColorContext.Provider
      value={{
        color,
        setColor
      }}
    >
      {props.children}
    </ColorContext.Provider>
  );
}

```


```jsx
// 导入ColorProvider，包裹子组件
    <ColorProvider>
      <div
          className={`w-full h-full label px-[10px] py-[10px]  ${pattern.flexbet}`}
        >
        ...
      </div>
        
    </ColorProvider>
```

```javascript
    <!--  消费 -->
    import {ColorContext} from '../Layout'
    console.log(useContext(ColorContext))
```










