import * as THREE from 'three'
import * as dat from 'dat.gui'


console.log(THREE)

//  three.js  坐标轴辅助器

// 导入轨道控制器
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 导入着色器
import basicVertexShader from './shader/vertex.glsl'
import basicFragmentShader from "./shader/fragment.glsl"


// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 2)

camera.aspect = window.innerWidth /window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera)



const params = {
    uWaresFrequency:20,
    uScale:0.1
}

// 着色器配置
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    side:THREE.DoubleSide,
    uniforms:{
        uWaresFrequency:{
            value:params.uWaresFrequency
        },
        uScale:{
            value:params.uScale
        }
    },
    transparent:true
})


// 创建平面
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 1024, 1024), shaderMaterial)
plane.rotation.x = -Math.PI /2 ;
scene.add(plane)




// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(10, 10, 10);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 4096;
spotLight.shadow.mapSize.height = 4096;


scene.add(spotLight);








// 初始化渲染器
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




const clock = new THREE.Clock()
// 每一帧进行渲染
function render() {
    let time = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(render)
}

render()


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.setPixelRatio()
})