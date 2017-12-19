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

    this.material_1 = new CGFappearance(this.scene);
	this.material_1.setAmbient(0.1, 0.1, 0.1, 1);
	this.material_1.setDiffuse(0.1, 0.19, 0.3, 1);
	this.material_1.setSpecular(0.5, 0.5, 0.5, 0);	
	this.material_1.setShininess(120);

    this.body = new MyCompleteCylinder(this.scene, 17, 2, 2, 20, 20, 1, 1);

    this.initBuffers();
};

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.draw_body = function(){
    console.log("desenha");
    this.scene.pushMatrix();
        this.material_1.apply();
        this.body.display();        
    this.scene.popMatrix();
}

/**
 * Initiates all Webcgf atributes of the primitive
 */
MyPiece.prototype.initBuffers = function () {
    console.log("vai desenhar o body xb");
    this.draw_body();
};