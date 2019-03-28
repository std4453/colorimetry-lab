attribute vec4 v_pos;
uniform vec4 u_sRGB;
uniform mat4 modelViewProjectionMatrix;

varying vec4 f_sRGB;

void main() {
    gl_Position = modelViewProjectionMatrix * v_pos;
    f_sRGB = u_sRGB;
}
