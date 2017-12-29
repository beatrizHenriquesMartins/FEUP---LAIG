/**
 * Class Animation - Bezier
 */
class BezierAnimation extends Animation {
    /**
     * Constructor
     * @param {*Cons} scene 
     * @param {*} id - tyoe of animation
     * @param {*} velocity - velocity of animation 
     * @param {*} bezierPoints - control points
     */
    constructor(scene, id, velocity, bezierPoints) {
        super(scene, id, velocity);

        this.bezierPoints = bezierPoints;
        this.p1 = bezierPoints[0];
        this.p2 = bezierPoints[1];
        this.p3 = bezierPoints[2];
        this.p4 = bezierPoints[3];
        
        console.log("O FINISH BEZIER",this.finished);
        
        this.t = 0;
        this.rotIt = 0 ;
        this.nodeMatrix = mat4.create();
        this.transformMatrix = mat4.create();

        this.calcDistance();

        this.time = this.distance/this.velocity;
        
        console.log("TEMPO",this.time);
    }

    /**
     * function where the calculus of the control points is done 
     * @param {*} deltaTime - actual time
     */
    calcPoints(deltaTime) {
        this.t = (deltaTime)/this.time;

        if (this.t > 1) {
            this.x = (Math.pow((1 - 1), 3) * this.p1[0]) + 3 * 1 * Math.pow(1 - 1, 2) * this.p2[0] + 3 * Math.pow(1, 2) * (1 - 1) * this.p3[0] + Math.pow(1, 3) * this.p4[0];
            this.y = Math.pow(1 - 1, 3) * this.p1[1] + 3 * 1 * Math.pow(1 - 1, 2) * this.p2[1] + 3 * Math.pow(1, 2) * (1 - 1) * this.p3[1] + Math.pow(1, 3) * this.p4[1];
            this.z = Math.pow(1 - 1, 3) * this.p1[2] + 3 * 1 * Math.pow(1 - 1, 2) * this.p2[2] + 3 * Math.pow(1, 2) * (1 - 1) * this.p3[2] + Math.pow(1, 3) * this.p4[2];
            return true;
        } else {
            this.x = (Math.pow((1 - this.t), 3) * this.p1[0]) + 3 * this.t * Math.pow(1 - this.t, 2) * this.p2[0] + 3 * Math.pow(this.t, 2) * (1 - this.t) * this.p3[0] + Math.pow(this.t, 3) * this.p4[0];
            this.y = Math.pow(1 - this.t, 3) * this.p1[1] + 3 * this.t * Math.pow(1 - this.t, 2) * this.p2[1] + 3 * Math.pow(this.t, 2) * (1 - this.t) * this.p3[1] + Math.pow(this.t, 3) * this.p4[1];
            this.z = Math.pow(1 - this.t, 3) * this.p1[2] + 3 * this.t * Math.pow(1 - this.t, 2) * this.p2[2] + 3 * Math.pow(this.t, 2) * (1 - this.t) * this.p3[2] + Math.pow(this.t, 3) * this.p4[2];
            
            var dx = 3 * Math.pow((1 - this.t), 2) * (this.p2[0] - this.p1[0]) + 6 * (1 - this.t) * this.t * (this.p3[0] - this.p2[0]) + 3 * Math.pow(this.t, 2) * (this.p4[0] - this.p3[0]);
            var dy = 3 * Math.pow((1 - this.t), 2) * (this.p2[1] - this.p1[1]) + 6 * (1 - this.t) * this.t * (this.p3[1] - this.p2[1]) + 3 * Math.pow(this.t, 2) * (this.p4[1] - this.p3[1]);
            var dz = 3 * Math.pow((1 - this.t), 2) * (this.p2[2] - this.p1[2]) + 6 * (1 - this.t) * this.t * (this.p3[2] - this.p2[2]) + 3 * Math.pow(this.t, 2) * (this.p4[2] - this.p3[2]);

            this.tangent = vec3.fromValues(dx, dy, dz);
        }
        
        return false;
    }

    /**
     * function to calculate the new matrix to animation ref
     */
    getTransformationMatrix(){
        let identiy_mat = mat4.create();
        let translated_mat = [];
        let final_mat = [];

        mat4.translate(translated_mat,identiy_mat,[this.x,this.y,this.z]);
        mat4.rotateY(final_mat,translated_mat,Math.atan2(this.x,this.z));

        this.transformMatrix = final_mat;
    }

    /**
     * function update
     * @param {*} deltaTime - actual time
     */
    update(deltaTime){
        if(this.calcPoints(deltaTime)){
            return false;
        }

        this.getTransformationMatrix();
        
        return true;
    }

    /**
     * function to go back
     */
    reset(){
        this.finished = false;
        this.rotIt = 0;
        this.t= 0;
    }

    /**
     * fucntion to calculate the angle between 2 vectors
     * @param {*} vecA - one vector (first)
     * @param {*} vecB - another vector (second)
     */
    calcAngle(vecA,vecB){
        vec3.normalize(vecA,vecA);
        vec3.normalize(vecB,vecB);

        return Math.acos(vec3.dot(vecA,vecB));
    }

    /**
     * function to calculate the distance
     */
    calcDistance(){
        var l1 = vec3.fromValues(this.p1[0],this.p1[1],this.p1[2]);
        var auxp2 = vec3.fromValues(this.p2[0],this.p2[1],this.p2[2]);
        var auxp3 = vec3.fromValues(this.p3[0],this.p3[1],this.p3[2]);
        var r4 = vec3.fromValues(this.p4[0],this.p4[1],this.p4[2]);
        var divide_aux = vec3.fromValues(2,2,2);

        var l2 = vec3.create();
        vec3.add(l2,l1,auxp2);
        vec3.divide(l2,l2,divide_aux);

        var h = vec3.create();
        vec3.add(h,auxp2,auxp3);
        vec3.divide(h,h,divide_aux);

        var l3 = vec3.create();
        vec3.add(l3,l2,h);
        vec3.divide(l3,l3,divide_aux);

        var r3 = vec3.create();
        vec3.add(r3,auxp3,r4);
        vec3.divide(r3,r3,divide_aux);

        var r2 = vec3.create();
        vec3.add(r2,h,r3);
        vec3.divide(r2,r2,divide_aux);

        this.distance = vec3.distance(l1,l2)  + vec3.distance(l2,l3) + vec3.distance(l3,r2) + vec3.distance(r2,r3) + vec3.distance(r3,r4);
        
        console.log("DISTANCIA", this.distance);
    }

    /**
     * function to claculate the axis with cross product
     * @param {*} axis - axis (x,y,z)
     * @param {*} vecA - one vector (first)
     * @param {*} vecB - another vector (second)
     */
    calcAxis(axis,vecA,vecB){
        vec3.cross(axis,vecA,vecB);
        
        return vec3.normalize(axis,axis);
    }

  
    /**
     * fucntion to clone
     */
    clone(){
        return new BezierAnimation(this.scene,this.id,this.velocity,this.bezierPoints);
    }
}