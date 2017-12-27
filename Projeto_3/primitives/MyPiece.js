function MyPiece(scene, type_piece) {
    CGFobject.call(this, scene);

    console.log("my piece");

    this.type_piece = type_piece;

    console.log("depois de criar var");
    
    if(this.type_piece === "white" || this.type_piece === "black" || this.type_piece === "mix"){
        console.log("the type of piece isn't wrong!");
        return;
    }

    this.body = new MyCompleteCylinder(this.scene, 10, 10, 10, 10, 10);

    this.initBuffers();
};
  
MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.draw_body = function(){
    this.scene.pushMatrix();
        this.body.display();
    this.scene.popMatrix();
}

MyPiece.prototype.display = function () {
  this.draw_body();
};