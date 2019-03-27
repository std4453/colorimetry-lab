precision mediump float;

varying vec4 color;

vec3 gamma_correct(vec3 raw) {
    bvec3 thres = lessThan(raw, vec3(0.0031308));
    vec3 case1 = raw * 12.92;
    vec3 case2 = 1.055 * pow(raw, vec3(1.0 / 2.4)) - 0.055;
    return mix(case2, case1, vec3(thres));
}

void main() {
    gl_FragColor = vec4(gamma_correct(color.rgb), color.a);
}
