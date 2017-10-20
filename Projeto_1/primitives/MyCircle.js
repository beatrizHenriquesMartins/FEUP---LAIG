/**
 * MyPrism
 * @constructor
 */
function MyCircle(scene, slices,radius) {
  CGFobject.call(this, scene);

  this.slices = slices;
  this.radius = radius;


  this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function () {
  this.vertices = [];

  this.normals = [];
  this.texCoords = [];

  var ang = 2 * Math.PI / this.slices;
  this.vertices.push(0, 0, 0);
  this.normals.push(0, 0, 1);
  this.texCoords.push(0.5, 0.5);

  for (let j = 0; j < this.slices; j++) {
    this.vertices.push(Math.cos(j * ang)*this.radius, Math.sin(j * ang)*this.radius, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5 + 0.5 * Math.cos(-j * ang), 0.5 + 0.5 * Math.sin(-j * ang));
  }


  this.indices = [];

  for (let i = 1; i <= this.slices; i++) {
    if (i == this.slices){
      this.indices.push(0, i, 1);
    }else{
      this.indices.push(0, i, i + 1);
    }
  }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};


MyCircle.prototype.loadTexture = function (texture) {

}
