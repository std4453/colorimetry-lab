precision mediump float;

uniform mat3 u_XYZ2sRGB;
varying vec3 xyY;

vec3 gamma_correct(vec3 raw) {
    bvec3 thres = lessThan(raw, vec3(0.0031308));
    vec3 case1 = raw * 12.92;
    vec3 case2 = 1.055 * pow(raw, vec3(1.0 / 2.4)) - 0.055;
    return mix(case2, case1, vec3(thres));
}

void main() {
    vec3 XYZ = vec3(xyY.z / xyY.y * xyY.x, xyY.z, xyY.z / xyY.y * (1.0 - xyY.x - xyY.y));
    vec3 rgb = clamp(u_XYZ2sRGB * XYZ, vec3(0.0), vec3(1.0));
    gl_FragColor = vec4(gamma_correct(rgb), 1.0);
}
