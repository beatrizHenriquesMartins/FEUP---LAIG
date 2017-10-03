/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene, minX, minY, maxX, maxY) {
	CGFobject.call(this, scene);
	this.lengths = 1;
	this.lengtht = 1;

	this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;
	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor = MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
		this.minX, this.maxY, 0,
		this.maxX, this.maxY, 0,
		this.minX, this.minY, 0,
		this.maxX, this.minY, 0
	];

	this.indices = [
		0, 1, 2,
		3, 2, 1

	];

	this.normals = [

		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1

	]

	this.texCoords = [
		0,this.lengtht,
		this.lengths,this.lengtht,
		0,0, 
		this.lengths,0 
		


	]
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};


MyQuad.prototype.loadTexture = function(texture)
{
	this.lengths = texture[1];
	this.lengtht = texture[2];
	this.initBuffers();
}