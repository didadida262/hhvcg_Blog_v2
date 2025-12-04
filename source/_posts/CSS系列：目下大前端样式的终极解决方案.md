---
title: CSS系列：目下大前端样式的终极解决方案
date: 2024-05-06 16:43:00
category: css专栏

---

#### 本文主要介绍tailwind，这个在我看来，能够解决目前前端领域中，各种样式问题的终极解决方案，的库。
<!-- 
前端包含的东西、方向太多，根本原因在于，各种场景下的需求，如图像标注平台、仿工控软件、在线文档编辑平台、实时行为识别系统以及各种客户端软件的实现等等，这些场景导致其能力在无限的扩展。任何一项单拿出来，都能罗列出诸多的内容。 -->
前端跟css相关的几个典型场景：`移动端适配、页面换肤`。相信做过的同学,无一不疯狂的掉过头发。倒不是说因为这个有多难，而是很烦，很杂。研发和产品互掐的重灾区。一套代码多端适用，确实很美好，但是这就要求项目从一开始就要严格关注到这个问题，以便后期的适配。

最近在帮一家海外的公司做项目时，发现他们的项目大量使用tailwind。更让我惊讶的是，他们的项目中，所使用到的组件，全部都是自己的开发人员自己实现的，搭配tailwind，对设计图的还原度，无限接近百分百，让我叹为观止。在接触他们之前的职业生涯中，基本上都是做的toB的业务，重逻辑功能的实现，至于ui，只要不是难看到人神共愤，基本上就可以了。接触了toC的业务之后突然发现，专业的前端，除了具备技术技能，还需要锻炼自身的美感。

#### tailwind这个库方便在哪？
- `极大的简化了css相关的代码`
- `完美解决各端适配的问题`
举例：
1. 在tailwind的配置文件中设定好自身需要的几种端的大小
```javascript
    screens: {
      xs: '300px',
      // => @media (min-width: 400px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px'
      // => @media (min-width: 1536px) { ... }
    },
```

2. 使用时如下，拿设置字体大小示范：
```javascript
  fontOswald16:
    'font-Oswald sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px]',
  fontOswald18:
    'font-Oswald sm:text-[18px] md:text-[18px] lg:text-[18px] xl:text-[18px] 2xl:text-[18px]',
  fontOswald24:
    'font-Oswald xs:text-[20px] sm:text-[24px] md:text-[24px] lg:text-[24px] xl:text-[24px] 2xl:text-[24px]',
  fontOswald32:
    'font-Oswald sm:text-[32px] md:text-[32px] lg:text-[32px] xl:text-[32px] 2xl:text-[32px]',
  fontOswald46:
    'font-Oswald sm:text-[46px] md:text-[46px] lg:text-[46px] xl:text-[46px] 2xl:text-[46px]',
  fontOswald48:
    'font-Oswald xs:text-[18px] sm:text-[48px] md:text-[48px] lg:text-[48px] xl:text-[48px] 2xl:text-[48px]',
  fontOswald52:
    'font-Oswald sm:text-[52px] md:text-[52px] lg:text-[52px] xl:text-[52px] 2xl:text-[52px]',

...
...
// 通常配置一个pattern文件单独存放所有设计好的字体配置，直接引入
    <div className={`${pattern.fontOswald24}`}></div>
```
这样，实现所有端情况下的字体大小。

- `需要样式高度定制项目的最佳实践方案`

#### 底层实现
从根源看，tailwind做的事情很简单，**样式原子化**。什么意思？就是把很多的样式提前写好，这样你在实际开发过程中，直接使用即可,如下所示。
```css
.btn {
  background-color: red;
  border-radius: 4px;
  padding: 10px;
}
```

```html
<button class="bg-red-500 rounded p-4">按钮</button>
```
当然，预先准备好的官方样式中可能多达几十万行的css原子，但是不用担心，打包时会通过treeshaking，把那些没用到的全部抖掉。

#### tailwind有一套自己的语法规则，前期需要花点成本。就目下来看，如果所在的组是做toC业务的，并且需要高度灵活的页面实现，tailwind应该是首选。