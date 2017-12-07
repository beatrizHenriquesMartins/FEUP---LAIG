#ifdef GL_ES
precision highp float;
#endif


varying vec3 vNormal;
uniform vec4 selectionColor;

void main(){


    gl_FragColor = selectionColor;
}