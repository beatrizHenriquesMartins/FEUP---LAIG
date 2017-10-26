class LinearAnimation extends Animation {
    constructor(scene, velocity, controlPoints) {
        super(scene, velocity);
        this.p1 = controlPoints[0];
        this.p2 = controlPoints[1];
        this.p3 = controlPoints[2];
    }
}