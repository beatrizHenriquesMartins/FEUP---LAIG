class Animation{
   constructor(scene,id,velocity){
       if(new.target === Animation){
           throw new TypeError("Can't instatiate abstract class");
       }

       this.scene = scene;
       this.velocity = velocity;
       this.id = id;
       this.finished = false;
   }

   isFinished(){
       return this.finished;
   }

   calcPoints(){
       
   }

    //Animation init
}




