import * as THREE from 'three'
import * as dat from 'dat.gui'


console.log(THREE)

//  three.js  坐标轴辅助器

// 导入轨道控制器
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 导入着色器
import rawVertexShader from './raw_shader/vertex.glsl'
import rawFragmentShader from "./raw_shader/fragment.glsl"


import baseVertexShader from './shader/vertex.glsl'
import baseFragmentShader from './shader/fragment.glsl'



// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

const textureLoader = new THREE.TextureLoader()

const texture = textureLoader.load('/assets/textures/ca.jpeg')



const baseShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: baseFragmentShader,
    side:THREE.DoubleSide
})

// 此类的工作方式与ShaderMaterial类似，不同之处在于内置的uniforms和attributes的定义不会自动添加到GLSL shader代码中。
const rawShaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: rawVertexShader,
    fragmentShader: rawFragmentShader,
    side: THREE.DoubleSide,
    // 传入数据
    uniforms: {
        uTime: {
            value: 0
        },
        uTexture: {
            value: texture
        }
    }
})

const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1,64,64), baseShaderMaterial)
floor.position.x =3;
scene.add(floor)
// 创建平面
const rawFloor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 64, 64), rawShaderMaterial)
scene.add(rawFloor)




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


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock()
// 每一帧进行渲染
function render() {
    let elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    rawShaderMaterial.uniforms.uTime.value = elapsedTime;
    requestAnimationFrame(render)
}

render()


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.setPixelRatio()
})