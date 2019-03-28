attribute vec4 v_pos;
attribute vec2 v_xy;
uniform mat4 modelViewProjectionMatrix;

varying vec2 xy;

void main() {
    gl_Position = modelViewProjectionMatrix * v_pos;
    xy = v_xy;
}
