/**
 * MyPiece is constructor for all types of piece of the game
 * @param {*} scene - scene 
 * @param {*} type_piece - type of piece (white, black, mix)
 */
function MyPiece(scene, type_piece) {
    CGFobject.call(this, scene);

    console.log("entrou no constructor my piece");
    console.log("type = ", type_piece);

    this.type_piece = type_piece;

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
    this.material_white.setAmbient(0.9, 0.95, 0.9, 1);
    this.material_white.setDiffuse(0.99, 0.99, 0.99, 1);
    this.material_white.setShininess(1, 1, 1, 1);
    this.material_white.setShininess(120);

    //black material
    this.material_black = new CGFappearance(this.scene);
    this.material_black.setAmbient(0, 0, 0, 1);
    this.material_black.setDiffuse(0, 0, 0, 1);
    this.material_black.setShininess(0, 0, 0, 1);
    this.material_black.setShininess(120);

    this.body = new MyCompleteCylinder(this.scene, 1, 0.5, 0.5, 200, 200, 1, 1);
    this.circle = new MyCircle(this.scene, 200, 0.25);

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
        this.scene.translate(0, 1.001, 0);
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
};
