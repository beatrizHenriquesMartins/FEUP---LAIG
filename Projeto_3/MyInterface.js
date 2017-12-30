//returns obj index on array a, or -1 if a does not contain obj
function contains(a,obj){
    for(var i=0; i < a.length;i++){
        if(a[i] === obj){
            return i;
        }
    }

    return -1;
}

/**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui
    
    this.gui = new dat.GUI();
    
    // add a group of controls (and open/expand by defult)
    let menu = {
        undo: this.scene.game.undo.bind(this.scene.game),
        replay: 'replay',
        scene: this.scene
    };

    let config = {
        newGame: this.requestNewConfig,
        gameMode: GAMEMODE.P1_VS_P2,
        botDifficulty: BOT_DIFFICULTY.EASY,
        theme: 0,
        loadTheme: this.loadTheme,
        scene: this.scene
    };


    this.gui.add(menu, 'undo').name('Undo');
    this.gui.add(menu, 'replay').name('Replay');
    let configFolder = this.gui.addFolder('Configuration');
    configFolder.add(config, 'gameMode', {
        'P1 vs P2': GAMEMODE.P1_VS_P2,
        'P1 vs BOT': GAMEMODE.P1_VS_BOT,
        'BOT vs BOT': GAMEMODE.BOT_VS_BOT,
    }).name('Game Mode');

    configFolder.add(config, 'botDifficulty', {
        'Easy': BOT_DIFFICULTY.EASY,
        'Hard': BOT_DIFFICULTY.HARD
    }).name('Bot Difficulty');

    
    configFolder.add(config, 'theme', {
        'Dojo': 0,
        'Garden': 1
    }).name('Theme');
    configFolder.add(config, 'loadTheme').name('Load Theme');
    configFolder.add(config, 'newGame').name('New Game');
    configFolder.open();

 
    
    return true;
};


MyInterface.prototype.addShadersGroup = function(selectables) {
    var group = this.gui.addFolder("Shaders");
    group.open();
    group.add(this.scene,'Shader', {
        'My Shader':0,
        'My Shader 2': 1,
        'My Shader 3': 2
    }).name('Shaders list');

    obj = this;
    group.add(this.scene,'Node',selectables).onChange(function(v){
        for(var i = 0; i  < selectables.length ; i++){
            if(selectables[i] == v){
                obj.scene.graph.clearSelectables();
                console.log("CHANGE ",i);
                obj.scene.graph.activeSelectable = i;
                
            }
        } 
    });

    group.addColor(this.scene,'selectionColor').name('Selection Color:');
    group.add(this.scene,'scaleFactor',-25,25).onChange(function(v){
        obj.scene.updateScaleFactor(v);
    });
}

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    this.gui.removeFolder("Lights");
    var group = this.gui.addFolder("Lights");
    group.open();
    
    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }

 
}

/**
 * Loads theme.
 */
MyInterface.prototype.loadTheme = function () {
    this.scene.loadTheme(this.theme);
};

MyInterface.prototype.requestNewConfig = function(){
    console.log('OLA');
    this.scene.newGame(this.gameMode,this.botDifficulty);
}

dat.GUI.prototype.removeFolder = function(name) {
    var folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
  }


  /**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function (event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this, event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode || event.which) {
        case(107):
            //this.scene.changeCamera();
            console.log(this.scene.game.boards);
            break;

	};
	var self = this;
	//Verifires when a key has been released (any key)
	window.onkeyup = function (e) {
		
	}
};
