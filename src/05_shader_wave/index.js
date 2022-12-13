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

camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera)

//创建gui对象
const gui = new dat.GUI();


const params = {
    uWaresFrequency: 20,
    uScale: 0.1,
    uXzScale: 1.5,
    uNoiseFrequency: 10,
    uNoiseScale: 1.5,
    uLowColor: "#ff0000",
    uHighColor: "#ffff00",
    uXspeed: 1,
    uZspeed: 1,
    uNoiseSpeed: 1,
    uOpacity: 1,
}

// 着色器配置
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uWaresFrequency: {
            value: params.uWaresFrequency
        },
        uScale: {
            value: params.uScale
        },
        uNoiseFrequency: {
            value: params.uNoiseFrequency,
        },
        uNoiseScale: {
            value: params.uNoiseScale,
        },
        uXzScale: {
            value: params.uXzScale,
        },
        uTime: {
            value: params.uTime,
        },
        uLowColor: {
            value: new THREE.Color(params.uLowColor),
        },
        uHighColor: {
            value: new THREE.Color(params.uHighColor),
        },
        uXspeed: {
            value: params.uXspeed,
        },
        uZspeed: {
            value: params.uZspeed,
        },
        uNoiseSpeed: {
            value: params.uNoiseSpeed,
        },
        uOpacity: {
            value: params.uOpacity,
        },
    },
    transparent: true
})

gui
    .add(params, "uWaresFrequency")
    .min(1)
    .max(100)
    .step(0.1)
    .onChange((value) => {
        shaderMaterial.uniforms.uWaresFrequency.value = value;
    });

gui
    .add(params, "uScale")
    .min(0)
    .max(0.2)
    .step(0.001)
    .onChange((value) => {
        shaderMaterial.uniforms.uScale.value = value;
    });

gui
    .add(params, "uNoiseFrequency")
    .min(1)
    .max(100)
    .step(0.1)
    .onChange((value) => {
        shaderMaterial.uniforms.uNoiseFrequency.value = value;
    });

gui
    .add(params, "uNoiseScale")
    .min(0)
    .max(5)
    .step(0.001)
    .onChange((value) => {
        shaderMaterial.uniforms.uNoiseScale.value = value;
    });

gui
    .add(params, "uXzScale")
    .min(0)
    .max(5)
    .step(0.1)
    .onChange((value) => {
        shaderMaterial.uniforms.uXzScale.value = value;
    });

gui.addColor(params, "uLowColor").onFinishChange((value) => {
    shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
});
gui.addColor(params, "uHighColor").onFinishChange((value) => {
    shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
});

gui
    .add(params, "uXspeed")
    .min(0)
    .max(5)
    .step(0.001)
    .onChange((value) => {
        shaderMaterial.uniforms.uXspeed.value = value;
    });

gui
    .add(params, "uZspeed")
    .min(0)
    .max(5)
    .step(0.001)
    .onChange((value) => {
        shaderMaterial.uniforms.uZspeed.value = value;
    });

gui
    .add(params, "uNoiseSpeed")
    .min(0)
    .max(5)
    .step(0.001)
    .onChange((value) => {
        shaderMaterial.uniforms.uNoiseSpeed.value = value;
    });

gui
    .add(params, "uOpacity")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((value) => {
        shaderMaterial.uniforms.uOpacity.value = value;
    });


// 创建平面
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 1024, 1024), shaderMaterial)
plane.rotation.x = -Math.PI / 2;
scene.add(plane)









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
    shaderMaterial.uniforms.uTime.value = time;

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