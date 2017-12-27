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

    this.body = new MyCompleteCylinder(this.scene, 1, 0.5, 0.5, 200, 200, 1, 1);

    this.initBuffers();
};
  
MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.draw_body = function(){
    this.scene.pushMatrix();
        this.scene.rotate(-(Math.PI)/2, 1, 0, 0);
        this.body.display();        
    this.scene.popMatrix();
}

/**
 * Initiates all Webcgf atributes of the primitive
 */
MyPiece.prototype.display = function () {
    this.draw_body();
};
