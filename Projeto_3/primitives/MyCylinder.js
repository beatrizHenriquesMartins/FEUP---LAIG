/**
 * Cylinder without the top and bottom circles used in MyCompleteCylinder
 * @param {*} scene the xml scene
 * @param {*} height the height of the cylinder
 * @param {*} bottomRadius radius of the bottom side of the cylinder
 * @param {*} topRadius radius of the top side of the cylinder 
 * @param {*} stacks 
 * @param {*} slices 
 */
function MyCylinder(scene, height, bottomRadius, topRadius, stacks, slices) {
    CGFobject.call(this, scene);

    this.scene = scene;

    this.texture;
    this.topRad = topRadius;
    this.bottomRad = bottomRadius;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

/**
 * Initiates all Webcgf atributes of the primitive
 */
MyCylinder.prototype.initBuffers = function () {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.originalTexCoords = [];

    var r = this.bottomRad;
    var delta_r = (this.topRad - this.bottomRad) / this.stacks;
    var delta_rad = 2 * Math.PI / this.slices;
    var delta_z = this.height / this.stacks;
    var m = this.height / (this.bottomRad - this.topRad);
    var maxheight;

    if (this.bottomRad > this.topRad){
        maxheight = this.topRad * m + this.height;
    }else{
      maxheight = this.bottomRad * m + this.height;
    }

    var indice = 0;
    var acc = 0;

    for (var i = 0; i <= this.stacks; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.vertices.push(r * Math.cos(j * delta_rad), r * Math.sin(j * delta_rad), i * delta_z);
            
            if (Math.abs(this.bottomRad - this.topRad) < 0.0001) {
                this.normals.push(Math.cos(j * delta_rad), Math.sin(j * delta_rad), 0);
            } else if (this.bottomRad > this.topRad) {
                this.normals.push(
                    maxheight * Math.cos(j * delta_rad) / Math.sqrt(Math.pow(this.bottomRad, 2) + Math.pow(maxheight, 2)),
                    maxheight * Math.sin(j * delta_rad) / Math.sqrt(Math.pow(this.bottomRad, 2) + Math.pow(maxheight, 2)),
                    this.bottomRad / Math.sqrt(Math.pow(this.bottomRad, 2) + Math.pow(maxheight, 2))
                );
            } else {
                this.normals.push(
                    maxheight * Math.cos(j * delta_rad) / Math.sqrt(Math.pow(this.topRad, 2) + Math.pow(maxheight, 2)),
                    maxheight * Math.sin(j * delta_rad) / Math.sqrt(Math.pow(this.topRad, 2) + Math.pow(maxheight, 2)),
                    this.topRad / Math.sqrt(Math.pow(this.topRad, 2) + Math.pow(maxheight, 2))
                );
            }

            this.originalTexCoords.push(j / this.slices, i / this.stacks);
        }

        r = (i + 1) * delta_r + this.bottomRad;
    }

    for (var i = 0; i < this.stacks; i++) {
        acc = 0;

        for (var j = 0; j < this.slices; j++) {
            this.indices.push(
                i * (this.slices + 1) + j,
                i * (this.slices + 1) + (j + 1),
                (i + 1) * (this.slices + 1) + (j + 1)
            );
            this.indices.push(
                (i + 1) * (this.slices + 1) + (j + 1),
                (i + 1) * (this.slices + 1) + j,
                i * (this.slices + 1) + j
            );
        }
    }

    this.texCoords = this.originalTexCoords.slice();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
 * //Function that applies the amp factors of the texture, since it is isnt necessary on the cylinder this 
 * function only exist to overload convenience
 */
MyCylinder.prototype.loadTexture = function (texture) {

}
