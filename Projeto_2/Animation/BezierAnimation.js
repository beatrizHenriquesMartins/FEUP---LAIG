class BezierAnimation extends Animation {
    constructor(scene, id, velocity, bezierPoints) {
        super(scene, id, velocity);
        this.p1 = bezierPoints[0];
        this.p2 = bezierPoints[1];
        this.p3 = bezierPoints[2];
        this.p4 = bezierPoints[3];
        this.t = 0;

        this.rotIt = 0 ;

        this.transformMatrix = mat4.create();
    }

    calcPoints() {
        var time = this.scene.deltaTime / 1000;

        this.rotIt +=  Math.PI/6 *(this.scene.deltaTime/1000);
        var distance = Math.sqrt(Math.pow(this.p4[0] - this.p1[0], 2) + Math.pow(this.p4[1] - this.p1[1], 2) + Math.pow(this.p4[2] - this.p1[2], 2));

        var inc = this.speed * time;

        if (this.t >= 1) {
            this.finished = true;
        } else {


            this.x = (Math.pow((1 - this.t), 3) * this.p1[0]) + 3 * this.t * Math.pow(1 - this.t, 2) * this.p2[0] + 3 * Math.pow(this.t, 2) * (1 - this.t) * this.p3[0] + Math.pow(this.t, 3) * this.p4[0];
            this.y = Math.pow(1 - this.t, 3) * this.p1[1] + 3 * this.t * Math.pow(1 - this.t, 2) * this.p2[1] + 3 * Math.pow(this.t, 2) * (1 - this.t) * this.p3[1] + Math.pow(this.t, 3) * this.p4[1];
            this.z = Math.pow(1 - this.t, 3) * this.p1[2] + 3 * this.t * Math.pow(1 - this.t, 2) * this.p2[2] + 3 * Math.pow(this.t, 2) * (1 - this.t) * this.p3[2] + Math.pow(this.t, 3) * this.p4[2];

            t += inc;

           var dx = 3 * Math.pow((1 - this.t), 2) * (this.p2[0] - this.p1[0]) + 6 * (1 - this.t) * this.t * (this.p3[0] - this.p2[0]) + 3 * Math.pow(this.t, 2) * (this.p4[0] - this.p3[0]);
           var dy = 3 * Math.pow((1 - this.t), 2) * (this.p2[1] - this.p1[1]) + 6 * (1 - this.t) * this.t * (this.p3[1] - this.p2[1]) + 3 * Math.pow(this.t, 2) * (this.p4[1] - this.p3[1]);
           var dz = 3 * Math.pow((1 - this.t), 2) * (this.p2[2] - this.p1[2]) + 6 * (1 - this.t) * this.t * (this.p3[2] - this.p2[2]) + 3 * Math.pow(this.t, 2) * (this.p4[2] - this.p3[2]);

            this.tangent = vec3.fromValues(dx, dy, dz);

        }

    }

    getTransformationMatrix(){
        mat4.identity(this.transformMatrix);
        mat4.translate(this.transformMatrix,this.transformMatrix,p1);
        var orient = vec3.fromValues(0,0,1);
        var axis = vec3.create();
        var angle = this.calcAngle(orient,this.tangent);
        if(angle == Math.PI){
            axis = vec3.fromValues(0,-1,0);
        }else{
            this.calcAxis(axis,orient,this.tangent);
        }

        mat4.rotate(this.transformMatrix,this.transformMatrix,this.rotIt,this.tangent);
        mat4.rotate(this.transformMatrix,this.transformMatrix,angle,axis);


    }

    resetT(){
        this.t= 0;
    }

    calcAngle(vecA,vecB){
        vec3.normalize(vecA,vecA);
        vec3.normalize(vecB,vecB);
        return Math.acos(vec3.dot(vecA,vecB));


    }

    calcAxis(axis,vecA,vecB){
        vec3.cross(axis,vecA,vecB);
        return vec3.normalize(axis,axis);
    }

    clone(){
        return new BezierAnimation(this.scene,this.id,this.velocity,this.bezierPoints);
    }
}