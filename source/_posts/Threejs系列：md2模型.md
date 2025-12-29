---
title: Threejs系列：md2模型
date: 2023-12-07 16:20:02
category: 前端三维系列
---

### 本文介绍如何将md2模型，导进我们的页面中

前面有介绍过使用gltf的loader，加载glb模型。那么针对古老的md2模型文件，如何操作呢？

**1. 导入md2库**

```javascript
import { MD2Character } from 'three/examples/jsm/misc/MD2Character.js';
```

**2. 加入一个平面贴图当作草地**

```javascript
const gt = new THREE.TextureLoader().load( 'textures/terrain/grasslight-big.jpg' );
const gg = new THREE.PlaneGeometry( 20, 20 );
const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

const ground = new THREE.Mesh( gg, gm );
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set( 8, 8 );
ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.colorSpace = THREE.SRGBColorSpace;
ground.receiveShadow = true;
scene.add( ground );
```

**3. 模型导入**
```javascript
let character = new MD2Character();
const playbackConfig = {

  speed: 1.0,
  wireframe: false

};
const config = {
  baseUrl: 'models/md2/ratamahatta/',
  body: 'ratamahatta.md2',
  skins: [ 'ratamahatta.png', 'ctf_b.png', 'ctf_r.png', 'dead.png', 'gearwhore.png' ],
  weapons: [[ 'weapon.md2', 'weapon.png' ],
          [ 'w_bfg.md2', 'w_bfg.png' ],
          [ 'w_blaster.md2', 'w_blaster.png' ],
          [ 'w_chaingun.md2', 'w_chaingun.png' ],
          [ 'w_glauncher.md2', 'w_glauncher.png' ],
          [ 'w_hyperblaster.md2', 'w_hyperblaster.png' ],
          [ 'w_machinegun.md2', 'w_machinegun.png' ],
          [ 'w_railgun.md2', 'w_railgun.png' ],
          [ 'w_rlauncher.md2', 'w_rlauncher.png' ],
          [ 'w_shotgun.md2', 'w_shotgun.png' ],
          [ 'w_sshotgun.md2', 'w_sshotgun.png' ]
  ]

};
const labelize = ( text ) => {

  const parts = text.split( '.' );

  if ( parts.length > 1 ) {

    parts.length -= 1;
    return parts.join( '.' );

  }

  return text;

}

const setupGUIAnimations =( character ) =>  {
  const folder = gui.addFolder( 'Animations' );
  const generateCallback = function ( animationClip ) {
    return function () {
      character.setAnimation( animationClip.name );

    };
  };

  const guiItems = [];
  const animations = character.meshBody.geometry.animations;
  for ( let i = 0; i < animations.length; i ++ ) {
    const clip = animations[ i ];
    playbackConfig[ clip.name ] = generateCallback( clip );
    guiItems[ i ] = folder.add( playbackConfig, clip.name, clip.name );

  }
}
const setupWeaponsGUI = ( character ) => {
  const folder = gui.addFolder( 'Weapons' );
  const generateCallback = function ( index ) {
    return function () {
      character.setWeapon( index );
      character.setWireframe( playbackConfig.wireframe );

    };
  };
  const guiItems = [];
  for ( let i = 0; i < character.weapons.length; i ++ ) {
    const name = character.weapons[ i ].name;
    playbackConfig[ name ] = generateCallback( i );
    guiItems[ i ] = folder.add( playbackConfig, name ).name( labelize( name ) );

  }

}
const setupSkinsGUI = ( character ) => {
  const folder = gui.addFolder( 'Skins' );
  const generateCallback = function ( index ) {
    return function () {
      character.setSkin( index );
    };
  };
  const guiItems = [];
  for ( let i = 0; i < character.skinsBody.length; i ++ ) {
    const name = character.skinsBody[ i ].name;
    playbackConfig[ name ] = generateCallback( i );
    guiItems[ i ] = folder.add( playbackConfig, name ).name( labelize( name ) );

  }
}
character.scale = 0.03;

character.onLoadComplete = function () {
  setupSkinsGUI( character );
  setupWeaponsGUI( character );
  setupGUIAnimations( character );
  character.setAnimation( character.meshBody.geometry.animations[ 0 ].name );

};

character.loadParts( config );
scene.add( character.root );
```

<!-- **4. 最终效果**
<img src="/img/threejs_md2_1.gif" alt="图片描述"> -->

