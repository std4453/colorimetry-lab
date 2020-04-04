precision mediump float;

varying vec2 f_tex;
varying float f_gray;

void main() {
    gl_FragColor = vec4(vec3(f_gray), 1.0);
}
