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

// 3.设置相机位置
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
camera.position.set(0, 0, 10)
scene.add(camera)



const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/assets/textures/particles/10.png');
const texture1 = textureLoader.load('/assets/textures/particles/9.png');
const texture2 = textureLoader.load('/assets/textures/particles/11.png');

let geometry=null;
let  points=null;

// 设置星系的参数
const params = {
    count: 1000,
    size: 0.1,
    radius: 5,
    branches: 4,
    spin: 0.5,
    color: "#ff6030",
    outColor: "#1b3984",
  };

// GalaxyColor
let galaxyColor = new THREE.Color(params.color);
let outGalaxyColor = new THREE.Color(params.outColor);
let material;
const generateGalaxy = () => {
  // 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // 生成顶点几何
  geometry = new THREE.BufferGeometry();
  //   随机生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);

  const scales = new Float32Array(params.count);

  //图案属性
  const imgIndex = new Float32Array(params.count)

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    const current = i * 3;

    // 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
    const branchAngel =
      (i % params.branches) * ((2 * Math.PI) / params.branches);

    const radius = Math.random() * params.radius;
    // 距离圆心越远，旋转的度数就越大
    // const spinAngle = radius * params.spin;

    // 随机设置x/y/z偏移值
    const randomX =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomY =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomZ =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;

    // 设置当前点x值坐标
    positions[current] = Math.cos(branchAngel) * radius + randomX;
    // 设置当前点y值坐标
    positions[current + 1] = randomY;
    // 设置当前点z值坐标
    positions[current + 2] = Math.sin(branchAngel) * radius + randomZ;

    const mixColor = galaxyColor.clone();
    mixColor.lerp(outGalaxyColor, radius / params.radius);

    //   设置颜色
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;



    // 顶点的大小
    scales[current] = Math.random();

    // 根据索引值设置不同的图案；
    imgIndex[current] = i%3 ;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("imgIndex", new THREE.BufferAttribute(imgIndex, 1));

// 4.着色器配置


material = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0,
      },
      uTexture:{
        value:texture
      },
      uTexture1:{
        value:texture1
      },
      uTexture2:{
        value:texture2
      },
      uTime:{
        value:0
      },
      uColor:{
        value:galaxyColor
      }

    },
  });
  //   生成点
  points = new THREE.Points(geometry, material);
  scene.add(points);
  console.log(points);
  //   console.log(123);
};
generateGalaxy()





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





// 每一帧进行渲染
function render() {
    controls.update()
    renderer.render(scene, camera)
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