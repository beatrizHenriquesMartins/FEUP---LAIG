class CicularAnimation extends Animation {
    constructor(scene, id,velocity, radius, ang_initial, rotation_angle, center) {
        super(scene,id, velocity);
        this.radius = radius;
        this.ang_initial = ang_initial;
        this.rotation_angle = rotation_angle;
        this.center = center;

        this.currentAngle = 0;
        this.currentDistance = 0;

        this.over = false;
    }

    calcPoints(){
      this.distance = this.rotation_angle * this.radius;
    }

    update(deltaTime){
      var time = (deltaTime/1000) * this.velocity;
    }

    clone(){
      return new CicularAnimation(this.scene, this.id,
        this.velocity, this.radius, this.ang_initial, this.rotation_angle, this.center);
    }
}
