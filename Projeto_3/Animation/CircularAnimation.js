/**
 * Class Animation - Circular
 */
class CircularAnimation extends Animation {
  /**
   * Constructor
   * @param {*} scene 
   * @param {*} id - type of animation
   * @param {*} velocity - velocity of animation
   * @param {*} radius - radius
   * @param {*} ang_initial - inicial angle
   * @param {*} rotation_angle - angle of rotation
   * @param {*} center - center
   */
  constructor(scene, id,velocity, radius, ang_initial, rotation_angle, center) {
    super(scene,id, velocity);
    
    this.radius = radius;
    this.ang_initial = ang_initial*Math.PI/180;
    this.rotation_angle = rotation_angle*Math.PI/180;
    this.deltaAngle;
    this.center = center;
    this.transformMatrix = mat4.create();
    
    console.log("ROTATION ANGLE",this.rotation_angle);
    
    this.time = Math.abs((this.rotation_angle*this.radius)/this.velocity);
  }

  /**
   * 
   * @param {*} deltaTime 
   */
  calcPoints(deltaTime){
    if(deltaTime > this.time){
      return true;
    }else {
      this.deltaAngle = this.ang_initial + (deltaTime/this.time)*this.rotation_angle;
    }
    
    return false;
  }

  /**
   * 
   */
  getTransformMatrix(){
    let identity_mat = mat4.create();
    let translated_mat = [];

    mat4.translate(translated_mat,identity_mat,this.center);
    mat4.rotateY(translated_mat,translated_mat,this.deltaAngle);
    mat4.translate(translated_mat,translated_mat,[this.radius,0,0]);
    
    this.transformMatrix = translated_mat;
  }

  /**
   * 
   * @param {*} deltaTime 
   */
  update(deltaTime){
    if(this.calcPoints(deltaTime)){
      return false;
    }

    this.getTransformMatrix();
    
    return true;
  }

  /**
   * 
   */
  reset(){
    this.finished = false;
    this.deltaAngle = 0;
  }

  /**
   * 
   */
  clone(){
    return new CicularAnimation(this.scene, this.id, 
      this.velocity, this.radius, this.ang_initial,
      this.rotation_angle, this.center);
  }
}
