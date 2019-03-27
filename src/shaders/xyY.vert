attribute vec4 vertexPosition;
attribute vec2 v_xy;
uniform mat4 modelViewProjectionMatrix;

varying vec2 xy;

void main() {
    gl_Position = modelViewProjectionMatrix * vertexPosition;
    xy = v_xy;
}
