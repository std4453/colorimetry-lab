attribute vec4 v_pos;
attribute vec2 v_xy;
uniform mat4 modelViewProjectionMatrix;
uniform float u_Y;

varying vec3 xyY;

void main() {
    gl_Position = modelViewProjectionMatrix * v_pos;
    xyY = vec3(v_xy, u_Y);
}
