#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uNMatrix;
uniform float displacement;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
    
    vNormal = aVertexNormal;
    vec3 newPosition = aVertexPosition +  vec3(displacement*0.1);

    gl_Position = uPMatrix*uMVMatrix*vec4(newPosition,1.0);
}