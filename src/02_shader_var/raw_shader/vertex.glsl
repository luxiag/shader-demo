precision lowp float;
// 位置
attribute vec3 position;
attribute vec2 uv;

// threejs 传入
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// shaderMaterial uniform 定义
uniform float uTime;

// 传给fragment的
varying vec2 vUv;
varying float vElevation;

void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    // 位置移动
    // modelPosition.x += 1.0;
    // modelPosition.z +=1.0;
    // modelPosition.z += modelPosition.x;

    modelPosition.z = sin((modelPosition.x +uTime)* 10.0)*0.1;
    modelPosition.z += sin((modelPosition.y +uTime) * 10.0)*0.1;

    vElevation = modelPosition.z;
    gl_Position = projectionMatrix * viewMatrix *modelPosition;

}