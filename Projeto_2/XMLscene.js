var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;

    this.selectables = [];
    this.Shader = 0;
    this.Node= 0;
    this.frame = 0;

    this.lightValues = {};

    this.selectablesValues = {};
    this.scaleFactor =1.0;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    
    this.initCameras();

    this.enableTextures(true);
    
    this.setUpdatePeriod(1/60*1000);
    this.lastUpdateTime = (new Date()).getTime();

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.Shaders = [
        new CGFshader(this.gl,"Shaders/myShader.vert","Shaders/myShader.frag"),
        new CGFshader(this.gl,"Shaders/myShader2.vert","Shaders/myShader2.frag"),
        new CGFshader(this.gl, "Shaders/varying.vert","Shaders/varying.frag"),
        new CGFshader(this.gl, "Shaders/texture1.vert","Shaders/texture1.frag"),
		new CGFshader(this.gl, "Shaders/texture2.vert","Shaders/texture2.frag"),
		new CGFshader(this.gl, "Shaders/texture3.vert","Shaders/texture3.frag"),
		new CGFshader(this.gl, "Shaders/texture3.vert","Shaders/sepia.frag"),
		new CGFshader(this.gl, "Shaders/texture3.vert","Shaders/convolution.frag")
    ]

    this.Shaders[4].setUniformsValues({uSampler2: 1});
    this.Shaders[5].setUniformsValues({uSampler2: 1});

    this.updateScaleFactor();
    
    this.axis = new CGFaxis(this);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
    
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];
            
            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
            
            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
    
}

XMLscene.prototype.updateScaleFactor = function(v){

    this.Shaders[0].setUniformsValues({displacement: this.scaleFactor});
    this.Shaders[1].setUniformsValues({displacement:this.scaleFactor});
	this.Shaders[2].setUniformsValues({normScale: this.scaleFactor});
	this.Shaders[5].setUniformsValues({normScale: this.scaleFactor});

}

/**
 * Initializes selectables
 */
XMLscene.prototype.initSelectables = function(){
    var i = 0;

    this.selectables = this.graph.getSelectables();
}




/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
}

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() 
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);
    this.interface.addShadersGroup(this.graph.selectables);
    console.log("CAUHWAIU",this.Node);
}


/**
 * Defaut update scene function
 */
XMLscene.prototype.update = function(currTime) {
    if(!this.graph.loadedOk)
        return "Error processing graph";
    
    this.deltaTime = currTime - this.lastUpdateTime || 0.0;
    this.Shaders[0].setUniformsValues({amplitude: (1+Math.sin(this.frame))/2})
    
    this.Shaders[1].setUniformsValues({amplitude:(1+Math.sin(3*this.frame))/2});
    this.frame+=this.deltaTime/1000;
    this.graph.update(this.deltaTime);
    

   //In the end
   this.lastUpdateTime = currTime;     
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup
    
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

  
    
    if (this.graph.loadedOk) 
    {        
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

		// Draw axis
		this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        var j = 0;
        for(var key in this.selectablesValues){
            if(this.selectablesValues.hasOwnProperty(key)){
                if(this.selectablesValues[key]){
                    this.graph.nodes[key].selectable = true;
                }else{
                    this.graph.nodes[key].selectable = false;
                }
            }
        }

        // Displays the scene.
        this.graph.displayScene();

    }
	else
	{
		// Draw axis
		this.axis.display();
	}
    

    this.popMatrix();
    
    // ---- END Background, camera and axis setup
    
}
