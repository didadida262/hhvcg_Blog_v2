---
title: Threejs系列：灯光
date: 2023-11-25 06:46:21
category: 前端三维系列
---

### 本文介绍threejs中的灯光相关设置
threejs中的光照配置的标配： **环境光 + 光源**
<img src="/img/threejs_灯光.png" alt="图片描述">

1. **环境光： 无处不在的光**
   ```javascript
    // 环境光
    const envLight = new THREE.AmbientLight('white', 1)
    scene.add(envLight)
   ```
`注意：不添加环境光，物体设置的颜色无法显示。`
2. **点光源**
   ```javascript
    // 灯光配置
    const pointLight = new THREE.PointLight(0xffffff,1, 1000)
    pointLight.position.set(2, 3, 2)
    pointLight.castShadow = true
    scene.add(pointLight)
    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize, 'white' );
    scene.add( pointLightHelper );
   ```
注意， 此处我们还加了一个helper帮助显示光源位置

3. **创建物体和地面**
   ```javascript
    // 物体
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const mesh = new THREE.MeshPhongMaterial(
    {
        color: 'black',
        shininess: 1000
    } ); 
    const cube = new THREE.Mesh(geometry, mesh)
    cube.position.set(0, 0.5, 0)
    cube.receiveShadow = true
    cube.castShadow = true
    scene.add(cube)

    // 地面面图形
    const floor = new THREE.Mesh(
    new THREE.PlaneGeometry( 10, 10 ),
    new THREE.MeshPhongMaterial( {color: 0x1b5120, side: THREE.DoubleSide} )
    )
    floor.receiveShadow = true

    // floor.rotation.x -= Math.PI / 2
    floor.rotateX(Math.PI / 2)
    scene.add( floor );
   ```

4. **render配置能显示阴影**
   ```javascript
    renderer.render(scene, camera)
   ```

最终效果如下：
<img src="/img/threejs_阴影.gif" alt="图片描述">


5. **针对导入的模型进行处理**
```javascript
    const dracoLoader = new DRACOLoader()
    dracoLoader.preload()
    dracoLoader.setDecoderPath("./draco/")
    loader.setDRACOLoader(dracoLoader)
    loader.load("Pistol_Model.glb", function(gltf) {
    console.log('success!!!')
    const air = gltf.scene
    console.log(air)
    air.position.set(2,3,2)
    air.traverse((child) => {
        if (child.name === 'Pistol_Hammer') {
        child.receiveShadow = true
        child.castShadow = true
        console.log('我是收起')
        }
    })
    scene.add(air)
    })
```
在加载成功的回调中，通过traverse获取目标物体，设置阴影。
<img src="/img/threejs_pis2.gif" alt="图片描述">

文毕。

