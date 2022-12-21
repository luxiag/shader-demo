import * as THREE from 'three'
import * as dat from 'dat.gui'


console.log(THREE)

//  three.js  坐标轴辅助器

// 导入轨道控制器
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 用于载入glTF 2.0资源的加载器。
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'

// 导入着色器
import basicVertexShader from './shader/vertex.glsl'
import basicFragmentShader from "./shader/fragment.glsl"


// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);

// 3.设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

// 4.创建纹理加载对象

// 加载CubeTexture的一个类。 
// 创建一个由6张图片所组成的纹理对象。
const cubeTextureLoader = new THREE.CubeTextureLoader();
// 加载6张图片
const envMapTexture = cubeTextureLoader.load([
    "/assets/textures/environmentMaps/0/px.jpg",
    "/assets/textures/environmentMaps/0/nx.jpg",
    "/assets/textures/environmentMaps/0/py.jpg",
    "/assets/textures/environmentMaps/0/ny.jpg",
    "/assets/textures/environmentMaps/0/pz.jpg",
    "/assets/textures/environmentMaps/0/nz.jpg",
])

// 则该纹理贴图将会被设为场景中所有物理材质的环境贴图。
scene.environment = envMapTexture;
// 在渲染场景的时候将设置背景，且背景总是首先被渲染的
scene.background = envMapTexture;

// 5. 创建材质
// 加载texture的一个类。
//texture 创建一个纹理贴图，将其应用到一个表面，或者作为反射/折射贴图。
const textureLoader = new THREE.TextureLoader();

const modelTexture = textureLoader.load('/assets/models/LeePerrySmith/color.jpg');
// 法线纹理
const normalTexture = textureLoader.load('/assets/models/LeePerrySmith/normal.jpg')

// 标准网格材质
const material = new THREE.MeshStandardMaterial({
    // 颜色贴图。
    map: modelTexture,
    // 用于创建法线贴图的纹理
    normalMap: normalTexture
})

/*
.onBeforeCompile ( shader : Shader, renderer : WebGLRenderer ) : undefined
在编译shader程序之前立即执行的可选回调。此函数使用shader源码作为参数。用于修改内置材质。

和其他属性不一样的是，这个回调在.clone()，.copy() 和 .toJSON() 中不支持。
*/
material.onBeforeCompile = (shader) => {
    // shader.v
    console.log(shader.vertexShader)
    /*
    每个#include ...都会插入Three.js依赖包里边特定文件夹中的代码
    进入到/node_modules/three/src/renders/shaders/文件夹中
    */

    //https://thebookofshaders.com/08/?lan=ch
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        mat2 rotate2d(float _angle){
          return mat2(cos(_angle),-sin(_angle),
                      sin(_angle),cos(_angle));
        }
        `
    )
    // objectNormal 处理法线
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        float angle = sin(position.y) *0.9;
        mat2 rotateMatrix = rotate2d(angle);
        
        
        objectNormal.xz = rotateMatrix * objectNormal.xz;
        `
    )
    //   transformed 处理位置
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

            
        transformed.xz = rotateMatrix * transformed.xz;
    
    
        `
    )
}
// 处理阴影


const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})
depthMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      mat2 rotate2d(float _angle){
        return mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle));
      }
      uniform float uTime;
      `
    );
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      float angle = sin(position.y+uTime) *0.9;
      mat2 rotateMatrix = rotate2d(angle);
      
      
      transformed.xz = rotateMatrix * transformed.xz;
  
  
      `
    )

}

// GLTF加载器 加载模型
const gltfLoader = new GLTFLoader();

gltfLoader.load('./models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
    //  加载成功完成后将会被调用的函数。该函数接收parse所返回的已加载的JSON响应。
    console.log(gltf.scene.children[0], 'gltf')
    const mesh = gltf.scene.children[0];
    mesh.material = material;
    // 开启阴影
    mesh.castShadow = true;
    // 设定自定义的深度材质
    mesh.customDepthMaterial = depthMaterial;
    scene.add(mesh);
})
















// 平面
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial()
)
plane.position.set(0, 0, -6);
plane.receiveShadow = true;
scene.add(plane)

// 直射光
const directionLight = new THREE.DirectionalLight('#ffffff', 1);
directionLight.castShadow = true;
directionLight.position.set(0, 0, 200)
scene.add(directionLight)


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