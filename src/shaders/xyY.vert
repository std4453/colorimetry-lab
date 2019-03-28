attribute vec4 v_pos;
attribute vec3 v_xyY;
uniform mat4 modelViewProjectionMatrix;

varying vec3 xyY;

void main() {
    gl_Position = modelViewProjectionMatrix * v_pos;
    xyY = v_xyY;
}
