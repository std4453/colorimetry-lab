attribute vec4 v_pos;
attribute vec2 v_tex;
attribute float v_gray;
uniform mat4 modelViewProjectionMatrix;

varying vec2 f_tex;
varying float f_gray;

void main() {
    gl_Position = modelViewProjectionMatrix * v_pos;
    f_tex = v_tex;
    f_gray = v_gray;
}
