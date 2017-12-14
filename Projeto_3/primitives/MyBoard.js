/**
 * MyBoard primitive
 * @constructor
 */
function MyBoard(scene, width, heigh, len) {
    CGFobject.call(this, scene);

    console.log("board ");
  
    this.width = width;
    this.heigh = heigh;
    this.len = len;

    this.cube = new MyUnitCubeQuad(scene);

    this.initBuffers();
};
  
MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.drawQuad = function() {
    this.scene.pushMatrix();
        this.scene.scale(this.width, 1/3, this.heigh);
        this.scene.translate((this.width/2), 0, 0);
        this.cube.display();
    this.scene.popMatrix();    
}
  
/**
 * Initiates all WEBCGF atributes of the primitive
 */
MyBoard.prototype.display = function () {
    for(let j = 1; j <= this.len; j++){
        if(j != 1){
            this.scene.translate(-1 * this.len + this.width, 0, this.heigh);
        }

        for(let i = 1; i <= this.len; i++){
            if(i === 1){
                this.drawQuad();
            }else{
                this.scene.translate(this.width, 0, 0);
                this.drawQuad();
            }
        }
    }
};