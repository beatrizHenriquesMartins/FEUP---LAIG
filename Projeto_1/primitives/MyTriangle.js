function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {

  this.x1 = x1;
  this.x2 = x2;
  this.x3 = x3;

  this.y1 = y1;
  this.y2 = y2;
  this.y3 = y3;

  this.z1 = z1;
  this.z2 = z2;
  this.z3 = z3;

  this.lengths = 1;
  this.lengtht = 1;

  CGFobject.call(this, scene);
  this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function () {

  this.a = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
  this.b = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
  this.c = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));

  this.beta = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);
  this.angle = Math.acos(this.beta);

  this.vertices = [this.x1, this.y1, this.z1,
    this.x2, this.y2, this.z2,
    this.x3, this.y3, this.z3
  ];

  this.indices = [0, 1, 2];

  this.normals = [];

  var vecx = (this.y2 - this.y1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.y3 - this.y1);
  var vecy = (this.x2 - this.x1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.x3 - this.x1);
  var vecz = (this.x2 - this.x1) * (this.y3 - this.y1) - (this.y2 - this.y1) * (this.x3 - this.x1);

  this.normals.push(vecx, vecy, vecz);
  this.normals.push(vecx, vecy, vecz);
  this.normals.push(vecx, vecy, vecz);

  this.auxTexCoords = [

    0, 1,
    this.c, 1,
    this.c - (this.a * this.beta),
    1 - (this.a * Math.sin(this.angle))
  ];

  this.texCoords = this.auxTexCoords.slice();
  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}

MyTriangle.prototype.loadTexture = function (texture) {

  this.lengths = texture[1];
  this.lengtht = texture[2];
  for (let i = 0; i < this.auxTexCoords.length; i += 2) {
    this.texCoords[i] = this.auxTexCoords[i] / this.lengths;
    this.texCoords[i + 1] = this.auxTexCoords[i + 1] / this.lengtht;
  }

  this.updateTexCoordsGLBuffers()
}