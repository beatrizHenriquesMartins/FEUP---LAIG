/**
 * o---o---o---o---o---o
 * |   |   |   |   |   |
 * o---o---o---o---o---o
 * |   |   |   |   |   |
 * o---o---o---o---o---o
 * |   |   |   |   |   |
 * o---o---o---o---o---o
 * |   |   |   |   |   |
 * o---o---o---o---o---o
 * |   |   |   |   |   |
 * o---o---o---o---o---o
 * need: circle, slip, cube
 */

 /**
 * MyBoard primitive
 * @constructor
 */
function MyBoard(scene, width, heigh, len) {
    CGFobject.call(this, scene);

    console.log("board ");
  
    //variaveis
    this.width = width;
    this.heigh = heigh;
    this.len = len;

    // o tabuleiro é um quadrado, logo é OBRIGATÓTRIO a altura e largura serem iguais
    if(this.width != this.heigh){
        console.log("width and heigh must be equal");
        return;
    }

    // material
    this.materialMetal = new CGFappearance(this.scene);
	this.materialMetal.setAmbient(0.3,0.3,0.3,1);
	this.materialMetal.setDiffuse(0.25,0.25,0.25,1);
	this.materialMetal.setSpecular(0.85,0.85,0.85,1);	
    this.materialMetal.setShininess(580);
    
    // primitives
    this.cube = new MyUnitCubeQuad(scene);
    this.strip =  new MyQuad(scene, 0.0, 0.5, 0.5, 0.0);

    this.initBuffers();
};
  
MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

/**
 * draw one piece of de board
 */
MyBoard.prototype.drawQuad = function() {
    this.scene.pushMatrix();
        this.scene.scale(this.width, 1/3, this.heigh);
        this.scene.translate((this.width/2), 1/3, (this.heigh/2));
        this.cube.display();
    this.scene.popMatrix();    
}

MyBoard.prototype.drawStrip_vertical = function() {
    this.scene.pushMatrix();
        this.scene.translate(-4, 0.3, -4);
        this.scene.scale(0.5, 1/2, this.heigh*this.len);
        this.scene.rotate(-(Math.PI / 2), 1, 0, 0);
        this.scene.rotate(-(Math.PI / 2), 0, 0, 1);
        this.materialMetal.apply();
        this.strip.display();
    this.scene.popMatrix();
}
/**
 * draw de complete board
 */
MyBoard.prototype.display = function () {
    //LINHA
    for(let ind = 0; ind < this.len; ind++){
        this.scene.pushMatrix();
            if(ind != 0){
                this.scene.translate(0, 0, (this.heigh * ind));
            }

            //COLUNA
            for (let index = 0; index < this.len; index++) {
                if(index === 0){
                    this.drawQuad();
                }else{
                    this.scene.pushMatrix();
                        this.scene.translate((this.width * index), 0, 0);
                        this.drawQuad();
                    this.scene.popMatrix();
                }
            }
        this.scene.popMatrix();
    }

    this.drawStrip_vertical();
};