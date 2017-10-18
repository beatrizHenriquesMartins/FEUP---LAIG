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

  this.v1 = vec3.fromValues(x1, y1, z1);
  this.v2 = vec3.fromValues(x2, y2, z2);
  this.v3 = vec3.fromValues(x3, y3, z3);

  CGFobject.call(this, scene);
  this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function () {

  var a = Math.sqrt(Math.pow(this.x1-this.x3,2) + Math.pow(this.y1-this.y3,2) + Math.pow(this.z1-this.z3,2));
  var b = Math.sqrt(Math.pow(this.x2-this.x1,2) + Math.pow(this.y2-this.y1,2) + Math.pow(this.z2-this.z1,2));
  var c= Math.sqrt(Math.pow(this.x3-this.x2,2) + Math.pow(this.y3-this.y2,2) + Math.pow(this.z3-this.z2,2));

  var beta = (Math.pow(a,2)-Math.pow(b,2)+Math.pow(c,2))/(2*a*c);
  var angle= Math.acos(beta) * Math.PI/180;

  var height = a * Math.sin(angle);
  var mid = c - a * Math.cos(angle);

  this.vertices = [
    this.x1, this.y1, this.z1,
    this.x2, this.y2, this.z2,
    this.x3, this.y3, this.z3
  ];

  this.indices = [
    0, 1, 2
  ];

  this.normals = [
    0, 1, 0,
    0, 1, 0,
    0, 1, 0
  ];

  this.auxTexCoords = [
    (c-a*beta)/this.lengths,(this.lengtht-a*Math.sin(angle))/this.lengtht,
    0,this.lengtht/this.lengtht,
    c/this.lengths,this.lengtht/this.lengtht
    
    

    
  ];

  this.texCoords = this.auxTexCoords.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}

MyTriangle.prototype.loadTexture = function(texture){
  for(let i=0; i < this.auxTexCoords.length; i+=2)
  {
    this.texCoords[i] = this.auxTexCoords[i]/this.lengths;
    this.texCoords[i+1] = this.auxTexCoords[i+1]/this.lengtht;
  }

  this.updateTexCoordsGLBuffers();
}
