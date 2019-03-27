attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

#pragma glslify: mult = require('./test_part.glsl', aVertexPosition = aVertexPosition, uModelViewMatrix = uModelViewMatrix, uProjectionMatrix = uProjectionMatrix)

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
