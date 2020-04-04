precision mediump float;

// #pragma glslify: cnoise2 = require(glsl-noise/classic/2d)

varying vec2 f_tex;
varying float f_gray;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main() {
    float noise = rand(rand(f_tex.x) + f_tex.y);
    bool hit = noise < f_gray;
    vec3 color = mix(vec3(0.0), vec3(1.0), vec3(bvec3(hit)));
    gl_FragColor = vec4(color, 1.0);
}
