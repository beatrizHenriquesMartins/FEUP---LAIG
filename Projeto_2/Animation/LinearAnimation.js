class LinearAnimation extends Animation {
    constructor(scene, id, velocity, controlPoints) {
        super(scene,id, velocity);
        this.p1 = controlPoints[0];
        this.p2 = controlPoints[1];
        this.p3 = controlPoints[2];

        if(controlPoints == NULL){
          throw new Error("Sem pontos de controlo!");
        }

        this.distance = 0;

        // para terminar a animacao
        this.over = false;
    }

    calcPoints(deltaTime){
      //x(t)=x0+v*t
      //y(t)=y0+v*t
      
    }

    update(deltaTime){

    }

    getTransformationMatrix(){

    }

    display(){

    }

    reset(){
        this.finished = false;
    }

    clone(){
      return new LinearAnimation(this.scene, this.id, this.velocity, this.controlPoints);
    }
}
