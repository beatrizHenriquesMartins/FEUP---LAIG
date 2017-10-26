class Animation{
   constructor(scene,velocity){
       if(new.target === Animation){
           throw new TypeError("Can't instatiate abstract class");
       }

       this.scene = scene;
       this.velocity = velocity;
   }

   calcPoints(){
       
   }

    //Animation init
}




