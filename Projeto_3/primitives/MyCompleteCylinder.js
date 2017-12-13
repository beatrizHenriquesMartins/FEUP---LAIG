/**
 * TheCompleteCylinder referenced in the lsx
 * @param {*} scene  the xmlscene
 * @param {*} height height of the cylinder
 * @param {*} bottomRadius radius of the bottom side of the cylinder
 * @param {*} topRadius radius of the top side of the cylinder 
 * @param {*} stacks  
 * @param {*} slices 
 * @param {*} top flag, if 1 cylinder is closed on top
 * @param {*} bot  flag, if 1 cylinder is closed on the bottom
 */
function MyCompleteCylinder(scene, height, bottomRadius, topRadius, stacks, slices, top, bot){
    this.top = top || 0;
    this.bot = bot || 0;

    this.scene = scene;
    this.height = height;

    this.normalCylinder = new MyCylinder(scene, height, bottomRadius, topRadius, stacks, slices);

    if(this.bot == 1){
        this.bottomCircle = new MyCircle(scene, slices, bottomRadius);
    }

    if(this.top == 1){
        this.topCircle = new MyCircle(scene, slices, topRadius);
    }
}

MyCompleteCylinder.prototype = Object.create(CGFobject.prototype);
MyCompleteCylinder.prototype.constructor = MyCompleteCylinder;

/**
 * Overload of the display since this class uses other objects
 */
MyCompleteCylinder.prototype.display = function(){
    this.normalCylinder.display();

    if(this.top == 1){
        this.scene.pushMatrix();
        this.scene.translate(0,0,this.height);
        this.topCircle.display();
        this.scene.popMatrix();
    }
    
    if(this.bot == 1){
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(-1, -1, 1);
        this.bottomCircle.display();
        this.scene.popMatrix();

    }
}

/**
 * //Function that applies the amp factors of the texture, since it is isnt necessary on the cylinder this 
 * function only exist to overload convenience
 */
MyCompleteCylinder.prototype.loadTexture = function (texture) {

}
