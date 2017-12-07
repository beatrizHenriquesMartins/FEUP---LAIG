#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float amplitude;
uniform float displacement;
varying vec3 vNormal;
uniform vec4 selectionColor;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);

	color.r = color.r * amplitude + color.g *0.769 + color.b * 0.189;
	color.g = color.r * 0.349 + color.g *0.168 + color.b * amplitude;
	color.b = color.r * 0.272 + color.g *0.534 + color.b * amplitude;

	gl_FragColor = color*selectionColor;
}