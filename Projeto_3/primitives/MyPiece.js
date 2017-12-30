/**
 * MyPiece is constructor for all types of piece of the game
 * @param {*} scene - scene 
 * @param {*} type_piece - type of piece (white, black, mix)
 */
function MyPiece(scene,x,y,z,type_piece) {
    CGFobject.call(this, scene);

    console.log("entrou no constructor my piece");
    console.log("type = ", type_piece);

    this.type_piece = type_piece;

    this.originalX = x;
    this.originalY = y;
    this.originalZ = z;

    this.x = x;
    this.y = y;
    this.z = z;

    this.animate = false;

    this.isUsable = true;

    if(this.type_piece === "white"){
        console.log("Type of piece is the rigth type");
    }else if(this.type_piece === "black"){
        console.log("Type of piece is the rigth type");
    }else if(this.type_piece === "mix"){
        console.log("Type of piece is the rigth type");
    }else{
        console.log("error type");
        return;
    }

    //EXEMPLE MATERIAL
    this.material_1 = new CGFappearance(this.scene);
    this.material_1.setAmbient(0.1, 0.1, 0.1, 1);
    this.material_1.setDiffuse(0.1, 0.19, 0.3, 1);
    this.material_1.setSpecular(0.5, 0.5, 0.5, 0);  
    this.material_1.setShininess(110);

    //white material
    this.material_white = new CGFappearance(this.scene);
    this.material_white.setAmbient(0.686, 0.686, 0.686, 1);
    this.material_white.setDiffuse(0.686, 0.686, 0.686, 1);
    this.material_white.setShininess(0.686, 0.686, 0.686, 1);
    this.material_white.setShininess(120);

    //black material
    this.material_black = new CGFappearance(this.scene);
    this.material_black.setAmbient(0, 0, 0, 1);
    this.material_black.setDiffuse(0, 0, 0, 1);
    this.material_black.setShininess(0, 0, 0, 1);
    this.material_black.setShininess(120);

    this.body = new MyCompleteCylinder(this.scene, 0.25, 0.25, 0.25, 30, 30, 1, 1);
    this.circle = new MyCircle(this.scene, 30, 0.125);

    this.initBuffers();
};
  
MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

/**
 * draw the body of piece
 */
MyPiece.prototype.draw_body = function(){
    this.scene.pushMatrix();
        this.scene.rotate(-(Math.PI)/2, 1, 0, 0);
        this.body.display();        
    this.scene.popMatrix();
}

/**
 * draw the circle of mix piece(white and black)
 */
MyPiece.prototype.draw_circle = function(){
    this.scene.pushMatrix();
        this.scene.translate(0, 0.251, 0);
        this.scene.rotate(-(Math.PI)/2, 1, 0, 0);
        this.circle.display();
    this.scene.popMatrix();    
};

/**
 * draw the mix piece, the body and the circle
 */
MyPiece.prototype.draw_mix_piece = function(){
    this.scene.pushMatrix();
        this.scene.pushMatrix();
            this.material_black.apply();
            this.draw_circle();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.material_white.apply();
            this.draw_body();
        this.scene.popMatrix();
    this.scene.popMatrix();
}

/**
 * Initiates all Webcgf atributes of the primitive
 */
MyPiece.prototype.display = function () {

    this.scene.pushMatrix()

    this.scene.translate(this.x,this.y,this.z);

    if (this.type_piece === "white") {
        this.scene.pushMatrix();
            this.material_white.apply();
            this.draw_body();
        this.scene.popMatrix();    
    }else if (this.type_piece === "black") {
        this.scene.pushMatrix();
            this.material_black.apply();
            this.draw_body();
        this.scene.popMatrix();  
    }else{
        this.draw_mix_piece();
    }

    this.scene.popMatrix();
};

/**
 * Initializes the 4 points necessary to calculate the bezier path
 */
MyPiece.prototype.setBezierPoints = function(){
    let p1 = [this.x,this.y,this.z];
    if(this.type_piece == 'white' || this.player == PLAYERS.WHITE)
        var p2 = [this.x,this.y+1,this.z-3]
    else{
        var p2 = [this.x,this.y+1,this.z+3]
    }
    let p3 = [this.targetx,this.targety+1,this.targetz];
    let p4 = [this.targetx,this.targety,this.targetz];

    this.p = [p1,p2,p3,p4];
    
    var animation = new BezierAnimation(this.scene,'id',5,this.p);
    this.animation = new AnimationRef(mat4.create(),animation);
    this.animate = true;
    this.animation.enable = 1;
}

/**
 * Initializes the 4 points to remove piece from board
 */

MyPiece.prototype.setRemovalPoints = function(){
    let p1 = [this.x,this.y,this.z];
    let p2 = [this.x,this.y+1,this.z];

    if(this.type_piece == 'white'){
        var p3 = [24,2.83+1,17];
        var p4 = [24,2.83,17];
    }else{
        var p3 = [16,2.83+1,23];
        var p4 = [16,2.83,23];
    }
        
    
    
    var p = [p1,p2,p3,p4];

    var animation = new BezierAnimation(this.scene,'remove',5,p);
    this.animation = new AnimationRef(mat4.create(),animation);
    this.animate = true;
    this.animation.enable = 1;
}



/**
 * Updates piece position if it needs to
 */
MyPiece.prototype.update = function(deltaTime){
    if(this.animate == false){
        return;
    }

 

    this.animation.update(deltaTime);
    this.x = this.animation.Animation.x;
    this.y = this.animation.Animation.y;
    this.z = this.animation.Animation.z;

    if(this.animation != null && this.animation.enable == 0)
    this.animate = false;



}

/**
 * Maps piece_type to integer
 */
MyPiece.prototype.transPiece = function(){
    if(this.type_piece == 'white')
        return PIECES.WHITE;
    if(this.type_piece == 'black')
        return PIECES.BLACK;
    if(this.type_piece == 'mix')
        return PIECES.MIX; 
}