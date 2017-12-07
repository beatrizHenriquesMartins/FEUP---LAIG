class LinearAnimation extends Animation {
    constructor(scene, id, velocity, controlPoints) {
      console.log('AQUI');
        super(scene,id, velocity);
        this.controlPoints = controlPoints;

        if(controlPoints == null){
          throw new Error("Sem pontos de controlo!");
        }
 
        this.distance = [];

        this.zAxis = [0,0,1];
        this.angles = [];
        this.times = [];
        this.nodeMatrix = mat4.create();
        this.transformMatrix = mat4.create();7
        this.animations = [];
        this.vec ;
        this.identiy_mat = mat4.create();
        this.auxmatrix;
        // para terminar a animacao
        this.over = false;
        this.calcDistance();
        this.calcTimes();
        this.getAnimations();
        
    }

    calcDistance(){
      this.distance.push(0);
      
            //calculo da distancia
            var ant_distance = 0;
            for(let i = 1; i < this.controlPoints.length ; i++){
              
              //calculos para construir um array de distancia de "control"
              var distanceX = Math.pow(this.controlPoints[i][0] - this.controlPoints[i-1][0],2);
              var distanceY = Math.pow(this.controlPoints[i][1] - this.controlPoints[i-1][1],2);
              var distanceZ = Math.pow(this.controlPoints[i][2] - this.controlPoints[i-1][2],2);
      
              var distanceTotal = Math.sqrt(distanceX + distanceY + distanceZ);
              
              distanceTotal += ant_distance;
              this.distance.push(distanceTotal);
              ant_distance = distanceTotal;
             
            }
    }

    calcTimes(){
      for(let i = 0; i<this.distance.length;i++){
        this.times.push(this.distance[i]/this.velocity)
      }
      this.time = this.distance[this.distance.length - 1] / this.velocity;
    }
    

    calcPoints(deltaTime){
   
      if (deltaTime > this.time) {
        return true;
      }
   
      if(deltaTime >= this.animations[0]['time'])
      {
        this.animations.shift();
        this.times.shift();
        this.identiy_mat = this.auxmatrix;
      }
      var animation_time = deltaTime - this.times[0];
      var animation_distance = animation_time*this.velocity;
      var p1 = this.animations[0]['p1'];
      var p2 = this.animations[0]['p2'];
      this.vec = vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
      vec3.normalize(this.vec,this.vec);
      var orient = vec3.fromValues(1,0,0);
      this.angles = this.calcAngle(orient,this.vec);
      this.vec[0] = this.vec[0]*animation_distance;
      this.vec[1] = this.vec[1]*animation_distance;
      this.vec[2] = this.vec[2]*animation_distance;
    
      return false;
       
    }

    getAnimations(){
      var ant_time = 0;
      var ant_distance = 0;
      for(var i = 1; i < this.distance.length; i++){
        this.animations.push({p1: this.controlPoints[i-1],p2: this.controlPoints[i], time : this.times[i], distance:this.distance[i],realtime : this.times[i] - ant_time, realdistance: this.distance[i] - ant_distance });
        ant_time = this.times[i];
        ant_distance = this.distance[i];
      }
    }

    getTransformationMatrix(){
      
      let translated_mat = [];
      let final_mat = [];
      mat4.translate(translated_mat,this.identiy_mat,[this.vec[0],this.vec[1],this.vec[2]]);

       mat4.rotateY(final_mat,translated_mat,this.angles);

      this.transformMatrix = final_mat;
      this.auxmatrix = translated_mat;
    }

    update(deltaTime){
      if(this.calcPoints(deltaTime))
        return false;
      this.getTransformationMatrix();
       return true;
      
     
    }

    reset(){
        this.finished = false;
    }

    clone(){
      return new LinearAnimation(this.scene, this.id, this.velocity, this.controlPoints);
    }

    calcAngle(vecA,vecB){
        vec3.normalize(vecA,vecA);
        vec3.normalize(vecB,vecB);
        return Math.acos(vec3.dot(vecA,vecB));
    }
}
