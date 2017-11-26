function AnimationRef(matrix,Animation){

    this.matrix = matrix;
    this.Animation = Animation;
    this.initialTime = 0;
    this.enable = 0;
    this.nodeInitialMatrix = matrix;
}

AnimationRef.prototype.constructor = AnimationRef;

AnimationRef.prototype.update = function(deltaTime){
    //console.log("ENTROU NO UPDATE ANIMATION REF");
    if(this.Animation.update(this.initialTime)){
        
        this.matrix = this.Animation.transformMatrix;
        //console.log("MATRIX",this.matrix)
        this.initialTime += (deltaTime/1000);
    }else {
        this.enable = 0;
        //this.Animation.reset();
    }
}