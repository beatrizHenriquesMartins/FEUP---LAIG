class BezierAnimation extends Animation{
    constructor(scene,id,velocity,bezierPoints){
        super(scene,id,velocity);
        this.p1 = bezierPoints[0];
        this.p2 = bezierPoints[1];
        this.p3 = bezierPoints[2];
        this.p4 = bezierPoints[3];
    }

    calcPoints(){
        var time = this.scene.deltaTime / 1000;

        var distance = Math.sqrt(Math.pow(this.p4[0]-this.p1[0],2) + Math.pow(this.p4[1] - this.p1[1],2) + Math.pow(this.p4[2]-this.p1[2],2));

        var inc = this.speed * time;
        
    }
}