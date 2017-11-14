class BezierAnimation extends Animation{
    constructor(scene,velocity,bezierPoints){
        super(scene,velocity);
        this.p1 = bezierPoints[0];
        this.p2 = bezierPoints[1];
        this.p3 = bezierPoints[2];
        this.p4 = bezierPoints[3];
    }

    calcPoints(){
        
    }
}