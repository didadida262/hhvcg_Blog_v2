---
title: Fps射击游戏开发：第二回
date: 2025-09-09 15:52:15
category: 游戏杂谈
---

#### 本文介绍
在上一篇文章中我们介绍了一些基本的先验内容，并且搭建了一个基础场景。本文目标，`挂载枪支`，并实现`子弹射击逻辑`

#### 枪支挂载
1. 首先需要创建枪支的刚体，用了三个cube搭建，同时把他用一个整体包裹，方便后续敌人复用。
<img src="/img/unity2_1.png" alt="图片描述" width="500">

2. 编写对应`Gun`和`GunController`，具体代码如下：

`Gun.cs`

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gun : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}

```

`GunController`
```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GunController : MonoBehaviour
{
    public Transform weaponHold;
    public Gun startingGun;
    Gun equippedGun;
    void Start()
    {
        if (startingGun != null)
        {
            EquipGun(startingGun);
        }
    }
    public void EquipGun(Gun gunToEquip)
    {
        if (equippedGun != null)
        {
            Destroy(equippedGun.gameObject);
        }
        equippedGun = Instantiate(gunToEquip, weaponHold.position, weaponHold.rotation) as Gun;
        equippedGun.transform.parent = weaponHold;
    }

}

```
GunController.cs文件直接拖入player这个刚体中绑定，就是那个大圆柱刚体。同时记得把Gun图形文件拖入GunController的Starting Gun中进行绑定。

3. 创建挂载点
因为我们需要枪支能够随着人物的位置、方向的变动而变动，所以通常做法就是给player设置一个`挂载点（空的刚体）`，在本文中，就是那个weapon Hold，将其拖入GunController的Weapon Hold中。以此完成挂载点图形和变量的绑定。

效果如下：
<img src="/img/unity2_2.gif" alt="图片描述" width="500">



#### 子弹射击

