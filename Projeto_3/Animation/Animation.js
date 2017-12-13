/**
 * class animation is a generic type of animation
 */
class Animation{
    /**
     * Constructor Animation
     * @param {*} scene 
     * @param {*} id - type of animation
     * @param {*} velocity - velocity of animation
     */
    constructor(scene,id,velocity){
        if(new.target === Animation){
           throw new TypeError("Can't instatiate abstract class");
        }

        this.scene = scene;
        this.velocity = velocity;
        this.id = id;
        this.finished = false;
    }

    /**
     *  function to know if animation is complete
     */
    isFinished(){
        return this.finished;
    }
    
    /**
     * function where the calculus of the control points is done 
     */
    calcPoints(){
       
    }
}




