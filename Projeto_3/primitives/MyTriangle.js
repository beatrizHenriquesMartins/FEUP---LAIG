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
/**
 *  Initiates all WEBCGF atributes of the primitive
 */
MyTriangle.prototype.initBuffers = function () {
  

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

 
  this.texCoords= [
    0,1,
    1,1,
    1,0,
  ]
  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}

/**
 * //Function that applies the amp factors of the texture
 */
MyTriangle.prototype.loadTexture = function (texture) {

  var lengths = texture[1];
  var lengtht = texture[2];

  var a = Math.sqrt(Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2) + Math.pow(this.z2 - this.z3, 2));
  var b = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
  var c = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2) + Math.pow(this.z1 - this.z2, 2));

  var beta = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
  var angle = Math.acos(beta);

  var h= a * Math.sin(angle);


  this.texCoords = [
    
        0, h/lengtht,
        c/lengths, h/lengtht,
        (c - a * beta)/lengths,  (h - a * Math.sin(angle))/lengtht
  ];


  this.updateTexCoordsGLBuffers()
}