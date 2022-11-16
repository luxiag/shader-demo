// 设置精度
precision lowp float;
varying vec2 vUv;
varying float vElevation;

uniform sampler2D uTexture;

void main(){
    // gl_FragColor = vec4(vUv, 0.0, 1);
    float height = vElevation+0.05*10.0;
    // gl_FragColor = vec4(1.0*height,1.0,1.0,1.0);
    // 根据vUv坐标 取出对应的颜色
    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb*=height;
    gl_FragColor = textureColor;
}