---
title: React系列：第三回(Redux)
date: 2024-03-09 21:44:24
category: React系列

---


### 本文见到那介绍下Redux的基本使用

```javascript
// 安装
cnpm install @reduxjs/toolkit react-redux
```
#### 一. 基本使用
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

#### 二. 异步获取更新值

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

**三. 总结一下**

` action --> dispatcher ---> store ---> view`, 同vuex如出一辙







