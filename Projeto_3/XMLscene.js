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
    this.Node = 0;
    this.frame = 0;
    this.cameras = [];
    this.lightValues = {};
    this.changingCamera = false;
    this.currentCamera = 0;

    this.selectablesValues = {};
    this.scaleFactor = 1.0;
    this.selectionColor = [0, 128, 255, 1];

}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.enableTextures(true);

    this.setUpdatePeriod(1 / 60 * 1000);
    this.lastUpdateTime = (new Date()).getTime();

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.theme = 0;
    this.setPickEnabled(true);
    this.clearPickRegistration();
    this.game = new Game(this);
    this.axis = new CGFaxis(this);

}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function () {
    var i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break; // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];

            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);

            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);

            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);

            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

            this.lights[i].setVisible(false);

            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();

            i++;
        }
    }

}
/**
 * Starts a new game
 * @param {*} gameMode 
 * @param {*} botDifficulty 
 */
XMLscene.prototype.newGame = function (gameMode, botDifficulty) {

    this.game.newGame(gameMode,botDifficulty);
    this.game.startGame();
    this.camera = this.cameras[0];
    this.game.startOverlay();
}

/**
 * Changes the current theme of the game
 * @param {*} theme 
 */
XMLscene.prototype.loadTheme = function (theme) {

    if (theme === 0) {
        let filename = getUrlVars()['file'] || "dojo.xml";
        this.cameras = [];
        this.initCameras();
        this.graph = new MySceneGraph(filename, this);
    } else if (theme === 1) {
        let filename = getUrlVars()['file'] || "garden.xml";
        this.cameras = [];
        this.initCameras();
        this.graph = new MySceneGraph(filename, this);
    }
}


/**
 * Initializes selectables
 */
XMLscene.prototype.initSelectables = function () {
    var i = 0;

    this.selectables = this.graph.getSelectables();
}

XMLscene.prototype.logPicking = function () {

    for (let obj of this.pickResults) {
        if (obj[0]) {
            var customId = obj[1];
            console.log(obj[0]);
            console.log("Picked object" + obj[0] + ",with pick id " + customId);
            this.game.picked(obj);
            //this.clearPickRegistration();
        }
    }
    this.pickResults.splice(0);


}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function () {

    this.cameras[0] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(4, 5, 10), vec3.fromValues(4, 1, 4));
    this.cameras[1] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(4, 5, 0), vec3.fromValues(4, 2.5, 4));
    this.camera = this.cameras[this.currentCamera];
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function () {
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this, this.graph.referenceLength);

    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
        this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

    this.camera = this.cameras[this.currentCamera];
    this.interface.setActiveCamera(this.camera);
    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);
    //this.interface.addShadersGroup(this.graph.selectables);

    //var suzanne = new MyObj(this, 'suzanne');
}

/**
 * Changes the current camera to the next one in the list
 */
XMLscene.prototype.changeCamera = function () {

    if (!this.changingCamera) {
        this.changingCamera = true;
        this.cameraChangedTime = 0;
    }

}



/**
 * Defaut update scene function
 */
XMLscene.prototype.update = function (currTime) {
    if (!this.graph.loadedOk)
        return "Error processing graph";


    this.deltaTime = currTime - this.lastUpdateTime || 0.0;

    this.game.update(this.deltaTime);

    this.frame += this.deltaTime / 1000;
    this.graph.update(this.deltaTime);
    this.animateCamera(this.deltaTime);

    //In the end
    this.lastUpdateTime = currTime;
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();


    this.logPicking();
    this.clearPickRegistration();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();



    if (this.graph.loadedOk) {
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

        // Draw axis
        this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(false);
                    this.lights[i].enable();
                } else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }


        // Displays the scene.
        this.interface.setActiveCamera(this.camera);
        this.graph.displayScene();
        this.game.display();


    } else {
        // Draw axis
        this.axis.display();
    }

    this.popMatrix();
    // ---- END Background, camera and axis setup
}

/**
 * The animation of changing the camera to another one
 * @param {*} deltaTime 
 */
XMLscene.prototype.animateCamera = function (deltaTime) {
    if (!this.changingCamera) {
        return;
    }
    if (this.cameraChangedTime > 1.5 * 0.95) {
        this.changingCamera = false;
        this.currentCamera = (this.currentCamera + 1) % this.cameras.length;
        this.camera = this.cameras[this.currentCamera];
        return;

    }

    let currCamera = this.cameras[this.currentCamera];
    let nextCamera = this.cameras[(this.currentCamera + 1) % this.cameras.length];

    let targetCenter = midpoint(currCamera.target, nextCamera.target);
    let posCenter = midpoint(currCamera.position, nextCamera.position);

    let targetRadius = distance(targetCenter, nextCamera.target);
    let positionRadius = distance(posCenter, nextCamera.position);

    this.cameraChangedTime += deltaTime / 1000;
    let cameraAngle = Math.PI * this.cameraChangedTime / 1.5;
    let multiplier = this.currentCamera ? -1 : 1;

    let targetPosition = [
        targetCenter[0],
        targetCenter[1],
        targetCenter[2],
        1
    ];

    let positionPos = [
        posCenter[0] + multiplier * positionRadius * Math.sin(cameraAngle) * 3,
        posCenter[1] * 2,
        posCenter[2] + multiplier * positionRadius * Math.cos(cameraAngle),
        1
    ];

    this.camera = new CGFcamera(currCamera.fov, currCamera.near, currCamera.far, positionPos, targetPosition);



}
/**
 * Calculates the mid point between two points
 * @param {*} pointA 
 * @param {*} pointB 
 */
function midpoint(pointA, pointB) {
    return [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2, (pointA[2] + pointB[2]) / 2, (pointA[3] + pointB[3]) / 2];
}

/**
 * Calculates the distance between two 3d coord
 * @param {*} pointA 
 * @param {*} pointB 
 */
function distance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2) + Math.pow(pointA[2] - pointB[2], 2));
}

/**
 * Sorting array by number handler
 * @param {*} a 
 * @param {*} b 
 */
function sortNumber(a,b) {
    return a - b;
}
