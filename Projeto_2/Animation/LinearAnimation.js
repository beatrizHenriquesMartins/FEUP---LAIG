class LinearAnimation extends Animation {
    constructor(scene, id, velocity, controlPoints) {
        super(scene,id, velocity);
        this.controlPoints = controlPoints;

        if(controlPoints == NULL){
          throw new Error("Sem pontos de controlo!");
        }

        this.distance = [];

        this.zAxis = [0,0,1];
        this.angles = [];

        // para terminar a animacao
        this.over = false;
    }

    calcPoints(){
      //calculo da distancia
      for(let i = 1; i < this.controlPoints.length ; i++){
        //calculos para construir um array de distancia de "control"
        var distanceX = Math.pow(this.controlPoints[i][0] - this.controlPoints[i-1][0],2);
        var distanceY = Math.pow(this.controlPoints[i][1] - this.controlPoints[i-1][1],2);
        var distanceZ = Math.pow(this.controlPoints[i][2] - this.controlPoints[i-1][2],2);

        var distanceTotal = Math.sqrt(distanceX + distanceY + distanceZ);

        this.distance.push(distanceTotal);

        //determinação da orientação do obj
        var p1 = vec3.fromValues(this.controlPoints[i-1][0], this.controlPoints[i-1][1],
          this.controlPoints[i-1][2]);
        var p2 = vec3.fromValues(this.controlPoints[i][0], this.controlPoints[i][1],
          this.controlPoints[i][2]);

        p1[1] = 0;
        p2[1] = 0;

        var angle = vec3.angle(p1,p2);

        this.angles.push(angle);
      }
    }

    update(deltaTime){
      //x(t)=x0+v*t
      //y(t)=y0+v*t
      
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
