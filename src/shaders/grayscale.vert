attribute vec4 v_pos;
attribute float v_gray;
uniform mat4 modelViewProjectionMatrix;

varying vec4 f_pos;
varying float f_gray;

void main() {
    f_pos = modelViewProjectionMatrix * v_pos;
    gl_Position = f_pos;
    f_gray = v_gray;
}
