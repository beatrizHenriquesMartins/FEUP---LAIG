/**
 * MySphere
 * @param {*} scene xml scene
 * @param {*} radius radius of the sphere
 * @param {*} slices 
 * @param {*} stacks 
 */
function MySphere(scene, radius, slices, stacks) {
  CGFobject.call(this, scene);

  this.radius = radius || 0;
  this.slices = slices || 0;
  this.stacks = stacks || 0;

  this.initBuffers();
}

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.construtor = MySphere;

/**
 * Initiates all WEBCGF atributes of the primitive
 */
MySphere.prototype.initBuffers = function () {
  this.indices = [];
  this.vertices = [];
  this.normals = [];
  this.texCoords = [];

  var dTheta = Math.PI / this.stacks;
  var dPhi = 2 * Math.PI / this.slices;

  for (var stack = 0; stack <= this.stacks; ++stack) {
    for (var slice = 0; slice <= this.slices; ++slice) {
      this.vertices.push(this.radius * Math.sin(stack * dTheta) * Math.cos(slice * dPhi), 
                         this.radius * Math.sin(stack * dTheta) * Math.sin(slice * dPhi), 
                         this.radius * Math.cos(stack * dTheta));
      this.normals.push(Math.sin(stack * dTheta) * Math.cos(slice * dPhi), 
                        Math.sin(stack * dTheta) * Math.sin(slice * dPhi), 
                        Math.cos(stack * dTheta));
      this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);
    }
  }

  for (var stack = 0; stack < this.stacks; ++stack) {
    for (var slice = 0; slice < this.slices; ++slice) {
      this.indices.push(stack * (this.slices + 1) + slice, 
                        (stack + 1) * (this.slices + 1) + slice, 
                        (stack + 1) * (this.slices + 1) + slice + 1);
      this.indices.push(stack * (this.slices + 1) + slice, 
                        (stack + 1) * (this.slices + 1) + slice + 1, 
                        stack * (this.slices + 1) + slice + 1);
    }
  }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
}

/**
 * //Function that applies the amp factors of the texture, since it is isnt necessary on the sphere this 
 * function only exist to overload convenience
 */
MySphere.prototype.loadTexture = function(texture){
 
}
