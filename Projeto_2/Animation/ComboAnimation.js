//série de animações
class ComboAnimation{
    constructor(Animations){
        this.Animations = Animations;
     /*   this.animationIndex = 0;
        this.transformMatrix = mat4.create();
        this.mediumMatrix = mat4.create();

        this.finish = false;*/
    }

    update(deltaTime){
       /* if(this.animationIndex <= (this.Animations.length-1) && this.Animations[this.animationIndex].update(deltaTime))
        {
            mat4.multiply(this.transformMatrix,this.mediumMatrix, this.Animations[this.animationIndex].transformMatrix);
         
        }else{
            if(!this.Animations[this.animationIndex].update(deltaTime))
                this.mediumMatrix = this.transformMatrix;

            if(this.animationIndex <= (this.Animations.length-1))
            {
                this.animationIndex++;
            }
            if(this.animationIndex == this.Animations.length)
                return false;

        }*/

    }

    isFinished(){
       // return this.isFinished;
    }

    reset(){
       /* for(var i = 0; i<this.Animations.length; i++)
        {
            this.Animations[i].reset();
        }*/
    }

}
