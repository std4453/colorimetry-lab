attribute vec4 vertexPosition;
attribute vec4 vertexColor;
uniform mat4 modelViewProjectionMatrix;

varying vec4 color;

void main() {
    gl_Position = modelViewProjectionMatrix * vertexPosition;
    color = vertexColor;
}
