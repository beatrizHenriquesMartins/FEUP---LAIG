function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {



  this.x1 =x1;
  this.x2 = x2;
  this.x3 = x3;
  this.y1 = y1;
  this.y2=y2;
  this.y3=y3;
  this.z1=z1;
  this.z2 = z2;
  this.z3 = z3;


  this.lengths = 1;
  this.lengtht = 1;

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
    this.x1,this.y1,this.z1,
    this.x2,this.y2,this.z2,
    this.x3,this.y3,this.z3
  ];



  this.indices = [
    0, 1, 2
  ];

  this.normals = [
    0,1,0,
    0, 1,0,
    0, 1, 0

  ]

  this.texCoords = [
    0,this.lengtht,this.lengths,this.lengtht,0,0,this.lengths,0

  ]
  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}

MyTriangle.prototype.loadTexture = function(texture){
  this.lengths = texture[1];
  this.lengtht = texture[2];
  
}