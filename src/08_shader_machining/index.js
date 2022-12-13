import * as THREE from 'three'
import * as dat from 'dat.gui'


console.log(THREE)

//  three.js  坐标轴辅助器

// 导入轨道控制器
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'




// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);

// 3.设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)


// 4.material 配置
let basicMaterial = new THREE.MeshBasicMaterial({
    color: "#00ff00",
    side: THREE.DoubleSide,
});

/*
.onBeforeCompile ( shader : Shader, renderer : WebGLRenderer ) : undefined
在编译shader程序之前立即执行的可选回调。此函数使用shader源码作为参数。用于修改内置材质。

和其他属性不一样的是，这个回调在.clone()，.copy() 和 .toJSON() 中不支持。
*/

const basicUnifrom = {
    uTime: {
        value: 0
    }
}
basicMaterial.onBeforeCompile = (shader) => {
    console.log(shader, 'basicMaterial')
    console.log(shader.fragmentShader, 'basicMaterial')
    console.log(shader.vertexShader, 'basicMaterial')

    shader.uniforms.uTime = basicUnifrom.uTime;
    // 根据上面打印出来的vertex进行替换
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform float uTime;
      `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      transformed.x += sin(uTime)* 2.0;
      transformed.z += cos(uTime)* 2.0;
      `
    )
}



// 5.创建平面
const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 64, 64), basicMaterial)





scene.add(floor)



// 6.初始化渲染器
/*
ShaderMaterial 只有使用 WebGLRenderer 才可以绘制正常，
 因为 vertexShader 和 fragmentShader 属性中GLSL代码必须使用WebGL来编译并运行在GPU中。
*/
const renderer = new THREE.WebGLRenderer()
// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)
renderer.render(scene, camera)






// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true



const clock = new THREE.Clock();


// 每一帧进行渲染
function render() {
    controls.update()
    renderer.render(scene, camera)

    
    const elapsedTime = clock.getElapsedTime();
    basicUnifrom.uTime.value = elapsedTime;

    requestAnimationFrame(render)
}

render()


//  监听窗口变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.setPixelRatio()
})