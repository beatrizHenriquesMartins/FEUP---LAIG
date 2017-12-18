/**
 * Cylinder without the top and bottom circles used in MyCompleteCylinder
 * @param {*} scene the xml scene
 * @param {*} height the height of the cylinder
 * @param {*} bottomRadius radius of the bottom side of the cylinder
 * @param {*} topRadius radius of the top side of the cylinder 
 * @param {*} stacks 
 * @param {*} slices 
 */
function MyPiece(scene, type) {
    CGFobject.call(this, scene);

    if(type == 'white' || type == 'black' || type == 'mix'){
        this.type = type;
    }

    this.initBuffers();
};

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

/**
 * Initiates all Webcgf atributes of the primitive
 */
MyPiece.prototype.initBuffers = function () {

};
