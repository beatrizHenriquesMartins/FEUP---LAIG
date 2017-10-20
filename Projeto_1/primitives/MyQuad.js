/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene, x1, y1, x2, y2) {
	CGFobject.call(this, scene);
	this.lengths = 1;
	this.lengtht = 1;

	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor = MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [ this.x1, this.y2, 0,
										this.x2, this.y2, 0,
										this.x1, this.y1, 0,
										this.x2, this.y1, 0 ];

	this.height = this.y1 - this.y2;
	this.width = this.x2 - this.x1;

	this.indices = [ 0, 1, 2,
									 3, 2, 1 ];

	this.normals = [ 0, 0, 1,
									 0, 0, 1,
									 0, 0, 1,
									 0, 0, 1 ];

	this.texCoords = [ 0, this.height/this.lengtht,
										 this.width/this.lengths,this.height/this.lengtht,
										 0,0,
										 this.width/this.lengths,0 ];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};


MyQuad.prototype.loadTexture = function(texture){
	this.lengths = texture[1];
	this.lengtht = texture[2];

	this.initBuffers();
}
