vec4 mult() {
    return uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}

#pragma glslify: export(mult)
