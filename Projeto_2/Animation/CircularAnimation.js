class CicularAnimation extends Animation {
    constructor(scene, velocity, radius, ang_initial, rotation_angle, center) {
        super(scene, velocity);
        this.radius = radius;
        this.ang_initial = ang_initial;
        this.rotation_angle = rotation_angle;
        this.center = center;
    }

    calcPoints(){
        
    }
}