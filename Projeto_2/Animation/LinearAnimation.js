class LinearAnimation extends Animation {
    constructor(scene, id, velocity, controlPoints) {
        super(scene,id, velocity);
        this.controlPoints = controlPoints;

        if(controlPoints == null){
          throw new Error("Sem pontos de controlo!");
        }

        this.distance = [];

        this.zAxis = [0,0,1];
        this.angles = [];

        this.nodeMatrix = mat4.create();
        this.transformMatrix = mat4.create();

        // para terminar a animacao
        this.over = false;
    }

    calcPoints(){

      this.distance.push(0);
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

        //para a vec3, só é capaz
        p1[1] = 0;
        p2[1] = 0;

        var angle = vec3.angle(p1,p2);

        this.angles.push(angle);
      }

      this.time = this.distance[this.distance.length - 1] / this.velocity;
    }

    getTransformationMatrix(vec, angle){
      let identiy_mat = mat4.create();
      let translated_mat = [];
      let final_mat = [];

      mat4.translate(translated_mat,identiy_mat,[vec[0],vec[1],vec[2]]);

      mat4.rotate(final_mat,translated_mat,angle,axis);

      this.transformMatrix = translated_mat;
    }

    update(deltaTime){
      // delta time = somatorio
      //x(t)=x0+v*t
      //y(t)=y0+v*t

      var deltaAux = this.time;

      var distanceGone = this.time * this.velocity;

      for(let i = 1; i<this.distance.length; i++){
        if(this.distance[i] >= distanceGone){
          var cp1 = this.controlPoints[i-1];
          var cp2 = this.controlPoints[i];
          var vec = vec3.fromValues(cp2[0]-cp1[0],cp2[1]-cp1[1],cp2[2]-cp1[2]);

          var distanceRatio = (this.distance[i] - distanceGone)/(this.distance[i] - this.distance[i-1]);

          vec3.scale(vec, vec, distanceRatio);
          getTransformationMatrix(vec, this.angles[i-1]);
        }
      }
    }
    
    reset(){
        this.finished = false;
    }

    clone(){
      return new LinearAnimation(this.scene, this.id, this.velocity, this.controlPoints);
    }
}
