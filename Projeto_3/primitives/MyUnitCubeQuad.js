function MyUnitCubeQuad(scene) {
    CGFobject.call(this, scene);

    this.quad = new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
    
    this.quad.initBuffers();
}
    
MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor = MyUnitCubeQuad;

    
MyUnitCubeQuad.prototype.display = function () {
    //face frontal
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
    this.scene.popMatrix();
        
    //face traseira
    this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
    this.scene.popMatrix();
        
    //face lateral direita
    this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
    this.scene.popMatrix();
        
    //face lateral esquerda
    this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
    this.scene.popMatrix();
        
    //face inferior
    this.scene.pushMatrix();    
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
    this.scene.popMatrix();
        
    //face superior
    this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
    this.scene.popMatrix();    
}