---
title: React系列：第二回(React-router)
date: 2024-03-08 12:55:50
category: React系列
---

**本文简单介绍下react-router的相关内容**

类似于vue-router，安装react-router配置react项目的路由。先安装一下：

```javascript
  cnpm install react-router-dom
```

### 简易版本
```javascript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const router = createBrowserRouter([
  {
    path: '/login',
    element: <div>我是登陆页面</div>
  },
  {
    path: '/index',
    element: <div>我是内容页面</div>
  }
])
...
...
// index入口文件配置
<RouterProvider router={router}></RouterProvider>

```
上面代码中，我们定义了两个路由的匹配规则，效果显示
<img src="/img/react-router1.gif" alt="">

### 通用路由配置

```javascript
// router文件
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginComponent from '../pages/Login'
import ContentComponent from '../pages/Content'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginComponent/>
  },
  {
    path: '/index',
    element: <ContentComponent/>
  }
])

export default router
```

分别写组件文件
```javascript
// login
const LoginComponent = () => {
    return <div>我是登录...</div>
}

export default LoginComponent

// content
const ContentComponent = () => {
    return <div>我是内容...</div>
}

export default ContentComponent
```
效果同1一致。
<img src="/img/react-router2.gif" alt="">


### 两种跳转方式：声明式导航和命令式导航

声明式导航通过Link，而编程式导航通过路由的钩子`useNavigate`

```javascript
// Content,使用命令式
import { Link, useNavigate } from 'react-router-dom'

const ContentComponent = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div>我是内容...</div>
            <button onClick={() => navigate('/login')}>跳转到login</button>
        </div>
    )
}

export default ContentComponent

// login，使用声明式
import { Link, useNavigation } from 'react-router-dom'

const LoginComponent = () => {
    return (
        <div>
            <div>我是登录...</div>
            <Link to="/index">跳转到内容区域</Link>
        </div>

    )
}

export default LoginComponent
```

效果如下：
<img src="/img/react-router3.gif" alt="">


### 参数获取
- `通过hook:useSearchParams获取当前url中的地址栏中的参数`
```javascript
// content
...
...
<button onClick={() => navigate('/login?id=10&name=hhvcg')}>跳转到login</button>

// login中使用hook获取
import { Link, useNavigation, useSearchParams } from 'react-router-dom'
const LoginComponent = () => {
    const [ params ] = useSearchParams()
    console.log('pramas>>>', params.get('id'))
    return (
        <div>
            <div>我是登录...</div>
            <Link to="/index">跳转到内容区域</Link>
        </div>
    )
}
export default LoginComponent
```

效果如下：
<img src="/img/react-router4.gif" alt="">

- `类似vue中的占位符配合hook:useParams获取参数`

```javascript
// 路由文件修改
  {
    path: '/login/:id',
    element: <LoginComponent/>
  }

  // 跳转写法修改
<button onClick={() => navigate('/login/10')}>跳转到login</button>

// 接收方式修改
    const params = useParams()
    console.log('pramas>>>', params)
```

效果如下：
<img src="/img/react-router5.gif" alt="">

### 嵌套路由
1. `给路由新增子路由，结构如下：`

```javascript
// router
  {
    path: '/',
    element: <LayoutComponent/>,
    children: [
      {
        path: 'about',
        element: <AboutComponent/>
      },
      {
        path: 'home',
        element: <HomeComponent/>
      }
    ]
  },

  // layout

  import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const LayoutComponent = () => {
    return (
        <div>
            <div>我是layout...</div>
            <Outlet></Outlet>
        </div>
    )
}

export default LayoutComponent

  // about
  import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const AboutComponent = () => {
    return (
        <div>
            <div>我是AboutComponent...</div>
        </div>
    )
}
export default AboutComponent

// home
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const HomeComponent = () => {
    return (
        <div>
            <div>我是HomeComponent...</div>
        </div>
    )
}

export default HomeComponent

```
我们给layout的children属性配置了两个子路由home、about,然后子路由的显示，通过`Outlet`占位， 效果如下：
<img src="/img/react-router6.gif" alt="">

2. `配置默认子路由`
```javascript
    children: [
      {
        index: true,
        element: <HomeComponent/>
      },
      {
        path: 'about',
        element: <AboutComponent/>
      },
    ]
```

3. `404页面路由`
```javascript
  {
    // 通配符
    path: '*',
    element: <NotfoundComponent />
  }
```

4. `两种路由模式`
**history和hash**
<img src="/img/react-router6.png" alt="">

一句话总结，前者利用h5提供的新的`api-history`，通过`pushState`、`popState`、`replaceState`事件切换路由；后者则是通过监听`hasChange`事件。


### 高阶组件配合token控制跳转
实现逻辑： 有token，正常跳转，无token，跳转到登录

```javascript
import { getToken } from '../utils/token';
import { Navigate } from 'react-router-dom';


const AuthRoute = ({ children}) => {
    const token = getToken()
    if (token) {
        return <>{children}</>
    } else {
        return <Navigate to='/login' replace />
    }
}

export default AuthRoute


// router.index

  {
    path: '/',
    element: <AuthRoute><LayoutComponent/></AuthRoute>,
    children: [
      {
        index: true,
        element: <HomeComponent/>
      },
      {
        path: 'about',
        element: <AboutComponent/>
      },
    ]
  },
```

### 本地模拟服务，查看build产物
```javascript
cnpm install -g serve

serve -s build
```

### 路由懒加载

```javascript
// 路由懒加载
const About = lazy(() => import('../pages/About'))
...
...
// Suspense包裹
{
  path: 'about',
  element: <Suspense fallback={'加载中'}><About/></Suspense>
},
```

效果如下：
<img src="/img/react-router7.gif" alt="">


