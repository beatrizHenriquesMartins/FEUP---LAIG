/**
 * o---o---o---o---o
 * |   |   |   |   |
 * o---o---o---o---o
 * |   |   |   |   |
 * o---o---o---o---o
 * |   |   |   |   |
 * o---o---o---o---o
 * |   |   |   |   |
 * o---o---o---o---o
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
    this.material_1 = new CGFappearance(this.scene);
	this.material_1.setAmbient(0.1, 0.1, 0.1, 1);
	this.material_1.setDiffuse(0.1, 0.19, 0.3, 1);
	this.material_1.setSpecular(0.5, 0.5, 0.5, 0);	
	this.material_1.setShininess(100000);
    
    // primitives
    this.cube = new MyUnitCubeQuad(scene);
    this.split =  new MyQuad(scene, 0.0, 0.5, 0.5, 0.0);
   

    this.balls = Array(25).fill({pick: false, circle : new MyCircle(scene,30,0.25)});

    this.initBuffers();
};
  
MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

/**
 * draw one piece of de board
 *  ----
 * |    |
 *  ----
 */
MyBoard.prototype.drawQuad = function() {
    this.scene.pushMatrix();
        this.scene.scale(this.width, 1/3, this.heigh);
        this.scene.translate((this.width/2), 1/2, (this.heigh/2));
        this.cube.display();
    this.scene.popMatrix();    
};

/**
 * draw the entire cube
 *  _______________
 * |               |
 * |               |
 * |               |
 * |               |
 * |               |
 * |               |
 * |               |
 * |_______________|
*/
MyBoard.prototype.drawCube = function() {
    //LINHA
    for(let ind = 0; ind < (this.len + 2); ind++){
        this.scene.pushMatrix();
            if(ind != 0){
                this.scene.translate(0, 0, (this.heigh * ind));
            }

            //COLUNA
            for (let index = 0; index < (this.len + 2); index++) {
                if(index === 0){
                    this.drawQuad();
                }else{
                    //desenha 1 quadrado
                    this.scene.pushMatrix();
                        this.scene.translate((this.width * index), 0, 0);
                        this.drawQuad();
                    this.scene.popMatrix();
                }
            }
        this.scene.popMatrix();
    }
};

/**
 * draw one split vertical
 * |
 * |
 */
MyBoard.prototype.drawStrip_vertical = function() {
    this.scene.pushMatrix();
        this.scene.translate(0, (1/3 + 0.01), 0);
        this.scene.scale(0.15, 1, ((this.heigh * this.len) * 2));
        this.scene.rotate(-(Math.PI / 2), 1, 0, 0);
        this.scene.rotate(-(Math.PI / 2), 0, 0, 1);
        this.split.display();
    this.scene.popMatrix();
};

/**
 * draw the entire vertical splits
 * |   |   |   |   |   |
 * |   |   |   |   |   |
 * |   |   |   |   |   |
 * |   |   |   |   |   |
*/
MyBoard.prototype.draw_all_vertical_splits = function(){
    for (let i = 0; i < (this.len + 1); i++) {
        if(i === 0){
            this.drawStrip_vertical();
        }else{
            this.scene.pushMatrix();
                this.scene.translate(((this.width * i) - (0.15 / 2)), 0, 0);
                this.drawStrip_vertical();
            this.scene.popMatrix();
        }
    }
};

/**
 * draw one split horizontal
 * -------
 */
MyBoard.prototype.drawStrip_horizontal = function() {
    this.scene.pushMatrix();
        this.scene.translate(0, (1/3 + 0.01), 0);
        this.scene.scale(((this.width * this.len) * 2), 1, 0.15);
        this.scene.rotate(-(Math.PI / 2), 1, 0, 0);
        this.scene.rotate(-(Math.PI / 2), 0, 0, 1);
        this.split.display();
    this.scene.popMatrix();
};

/**
 * ____________________
 * ____________________
 * ____________________
 * ____________________
 * ____________________
 */
MyBoard.prototype.draw_all_horizontal_splits = function () {
    for (let j = 0; j < (this.len + 1); j++) {
        if(j === 0){
            this.drawStrip_horizontal();
        }else{
            this.scene.pushMatrix();
                this.scene.translate(0, 0, ((this.heigh * j) - (0.15 / 2)));
                this.drawStrip_horizontal();
            this.scene.popMatrix();
        }
    }
};

/**
 * draw one little ball filled
 * o
 */
MyBoard.prototype.drawBallFilled = function(index) {
    this.scene.pushMatrix();
        this.scene.translate(0, (1/3 + 0.01), 0);
        this.scene.rotate(-(Math.PI / 2), 1, 0, 0);
        if(this.balls[index].pick){
            this.balls[index].circle.pick = 'board';
            this.scene.registerForPick((index+1),this.balls[index].circle);
        }
        
        this.balls[index].circle.display();
    this.scene.popMatrix();
};

/**
 * o   o   o   o   o   o
 * 
 * o   o   o   o   o   o
 * 
 * o   o   o   o   o   o
 * 
 * o   o   o   o   o   o
 * 
 * o   o   o   o   o   o
 */
MyBoard.prototype.draw_all_ball = function() {
    var ballind = 0;
    for (let k = 0; k < (this.len + 1); k++) {
        this.scene.pushMatrix();
            if(k !=0){
                this.scene.translate(0, 0, ((this.heigh * k) - (0.125 / 2)));
            }

            for (let m = 0; m < (this.len + 1); m++) {
                if(m === 0){
                    this.drawBallFilled(ballind);
                }else{
                    this.scene.pushMatrix();
                        this.scene.translate(((this.width * m) - (0.125 / 2)), 0, 0);
                        this.drawBallFilled(ballind);
                    this.scene.popMatrix();
                }
                ballind++;
            }
        
        this.scene.popMatrix();
        
    }
};

/**
 * draw de complete board
 */
MyBoard.prototype.display = function () {

   
    //quadrados
    this.drawCube();
    
    this.scene.pushMatrix();
        this.scene.translate(this.width, 0, this.heigh);
        this.material_1.apply();
        //linhas verticais
        this.draw_all_vertical_splits();
    
        //linhas horizontais
        this.draw_all_horizontal_splits();

        //bolinhas preenchidas
        this.draw_all_ball();
    this.scene.popMatrix();    
};