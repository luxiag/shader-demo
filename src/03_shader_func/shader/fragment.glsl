precision lowp float;


varying vec2 vUv;

void main(){
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    float strength = vUv.x;
    gl_FragColor = vec4(strength,strength,strength,1);
}