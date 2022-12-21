import * as THREE from 'three'
import * as dat from 'dat.gui'
import {
    RGBELoader
} from "three/examples/jsm/loaders/RGBELoader";
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";

import gsap from "gsap";



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
camera.position.set(0, 0, 10)

camera.aspect = window.innerWidth / window.innerHeight;

camera.updateProjectionMatrix();

scene.add(camera)


// 着色器配置
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    uniforms: {},
    side: THREE.DoubleSide,
    // transparent: true
})


const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("/assets/textures/2k.hdr").then((texture) => {
    // 纹理映射 能动
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //   背景和环境
    scene.background = texture;
    scene.environment = texture;
});



// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(10, 10, 10);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 4096;
spotLight.shadow.mapSize.height = 4096;


scene.add(spotLight);






// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    alpha: true
})
// 
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// 曝光程度
renderer.toneMappingExposure = 0.3


// 加载孔明灯

const gltfLoader = new GLTFLoader()

let LightBox = null
gltfLoader.load("/assets/models/flyLight.glb", gltf => {
    // scene.add(gltf.scene)
    // 获取孔明灯
    LightBox = gltf.scene.children[1]
    // 设置 material
    LightBox.material = shaderMaterial;

    for (let i = 0; i < 150; i++) {
        let flyLight = gltf.scene.clone(true);
        let x = (Math.random() - 0.5) * 300;
        let y = Math.random() + 25;
        let z = (Math.random() - 0.5) * 300;
        flyLight.position.set(x, y, z);
        gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 15 + Math.random() * 30,
            repeat: -1
        })
        gsap.to(flyLight.position,{x:"+=" + Math.random(),y:"+=" + Math.random()*10,yoyo:true,duration: 5+Math.random()*10,repeat:-1})
        scene.add(flyLight);

    }
})

// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)




renderer.render(scene, camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true

controls.autoRotate = true 
controls.autoRotateSpeed = 0.1;



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