class CicularAnimation extends Animation {
    constructor(scene, id,velocity, radius, ang_initial, rotation_angle, center) {
        super(scene,id, velocity);
        this.radius = radius;
        this.ang_initial = ang_initial;
        this.rotation_angle = rotation_angle;
        this.center = center;
    }

    calcPoints(){
        
    }

    clone(){
        return new CircularAnimation(this.scene,this.id,this.velocity,this.radius,this.ang_initial,this.rotation_angle,this.center);
    }
}