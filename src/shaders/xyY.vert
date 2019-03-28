attribute vec4 v_pos;
attribute vec2 v_xy;
uniform float u_Y;
uniform mat4 modelViewProjectionMatrix;

varying vec3 f_xyY;

void main() {
    gl_Position = modelViewProjectionMatrix * v_pos;
    f_xyY = vec3(v_xy, u_Y);
}
