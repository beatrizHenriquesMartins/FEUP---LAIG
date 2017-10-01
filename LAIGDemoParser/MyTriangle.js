function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {


  this.minS = 0;
  this.minT = 0;
  this.maxS = 1;
  this.maxT = 1;

  this.v1 = vec3.fromValues(x1, y1, z1);
  this.v2 = vec3.fromValues(x2, y2, z2);
  this.v3 = vec3.fromValues(x3, y3, z3);

  CGFobject.call(this, scene);
  this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function () {



  this.vertices = [
    this.v1[0], this.v1[1], this.v1[2],
    this.v2[0], this.v2[1], this.v2[2],
    this.v3[0], this.v3[1], this.v3[2]
  ];



  this.indices = [
    0, 1, 2
  ];

  this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1

  ]

  this.texCoords = [
    this.minS, this.maxT,
    this.maxS, this.maxT,
    this.maxS, this.maxT,
    this.minS, this.maxT

  ]
  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}