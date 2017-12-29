class Game {
    /**
     * Constructor for the Game classe, initializes the prolog Handler
     */
    constructor(scene) {
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.boards = [];
        this.movements = [];
        
        this.pieces = [];
        this.whitePieces = [];
        this.blackPieces = [];
        this.scores = [];
        this.scene = scene;
        this.board;
        this.gameMode;
        this.createPieces();

    }
    /**
     * Sets new game scene, reset game state, sets gameMode.
     * @param {*} scene 
     * @param {*} gameMode 
     */
    newGame(gameMode) {
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.gameMode = gameMode;
        this.pieces = [];
        this.movements = [];
        this.scores = [];
        this.currentPlayer = PLAYERS.WHITE;
        this.botIsPlaying = false;
        this.lastMoves = [];
        this.difficulties = [BOT_DIFFICULTY.EASY, BOT_DIFFICULTY.NORMAL];
    }

    startGame() {

        initializeVariables(this.getBoard.bind(this));

        this.updateAuxVars();
        if (this.gameMode == GAMEMODE.BOT_VS_BOT) {
            this.gameMode = GAMEMODE.BOT_VS_BOT;
            this.gameStatus = GAMESTATE.BOT_PLAY;
        } else {
            if (this.gameMode == GAMEMODE.P1_VS_BOT) {
                this.gameMode = GAMEMODE.P1_VS_BOT;
            } else 
                this.gameMode = GAMEMODE.P1_VS_P2;
            this.gameStatus = GAMESTATE.NORMAL;
        }


        this.timeSinceLastPlay = 0;
        this.fullGameTime = 0;

    }


    setBoard(board) {
        if (this.board != null) {
            this.boards.unshift(this.board);
        }
        this.board = board;
    }

    setScore(Score, Player) {
        if (this.blackScore != null && this.whiteScore != null) {
            this.scores.unshift({
                white: this.whiteScore,
                black: this.blackScore
            });
        }

        if (Player == PLAYERS.WHITE) {
            this.whiteScore = Score;
        } else {
            this.blackScore = Score;
        }
    }

    setPlayerPieces(Pieces, Player) {
        if(this.whitePieces != [] && this.blackPieces != []){
            this.pieces.unshift({
                white: this.whitePieces,
                black: this.blackPieces
            });
        }

        if (Player == PLAYERS.WHITE) {
            this.whitePieces = Pieces;
        } else {
            this.blackPieces = Pieces;
        }
    }

    getBoard(data) {

        this.setBoard(JSON.parse(data.target.response));
    }

    getScores(Player, data) {
        this.setScore(JSON.parse(data.target.response), Player);
    }

    getPieces(Player, data) {
        this.setPlayerPieces(JSON.parse(data.target.response), Player);
    }

    /**
     * Gets the current player.
     * @returns {number} Returns the current player, index based on 0.
     */
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    updateAuxVars() {
        getScore(PLAYERS.WHITE, this.getScores.bind(this, PLAYERS.WHITE));
        getScore(PLAYERS.BLACK, this.getScores.bind(this, PLAYERS.BLACK));
        getPieces(PLAYERS.WHITE, this.getPieces.bind(this, PLAYERS.WHITE));
        getPieces(PLAYERS.BLACK, this.getPieces.bind(this, PLAYERS.BLACK));
    }

    getGameStatus() {
        switch (this.gameStatus) {
            case GAMESTATE.NORMAL:
                return "select a piece to move";
            case GAMESTATE.PLACE_PIECE:
                return "select the tile to move the ship";
        }
    }

    createPieces(){
        this.createBlackPieces();
        this.createWhitePieces();
        this.createMixPieces();
    }

    createBlackPieces(){
        this.sceneBlackPieces = [];
        for(var i = 0; i < 10; i++){
            this.sceneBlackPieces[i] = new MyPiece(this.scene,(i/2.0)+1,3.25,0,'black');
        }
    }

    createWhitePieces(){
        this.sceneWhitePieces = [];
        for(var i = 0; i < 10; i++){
            this.sceneWhitePieces[i] = new MyPiece(this.scene,(i/2.0)+1,3.25,7,'white'); 
        }
    }

    createMixPieces(){
        this.sceneMixPieces = [];
        for(var i = 0; i <5; i++){
            if(i <= 2){
                this.sceneMixPieces[i] = new MyPiece(this.scene,((i+10)/2.0)+1,3.25,7,'mix');
                this.sceneMixPieces[i].player = PLAYERS.WHITE;
            }
          
            else{
                this.sceneMixPieces[i] = new MyPiece(this.scene,((i+7)/2.0)+1,3.25,0,'mix');
                this.sceneMixPieces[i].player = PLAYERS.BLACK;
            }
        }
    }

    updateGameState() {
        switch (this.gameStatus) {
            case GAMEMODE.P1_VS_P2:
                this.gameStatus = GAMESTATE.NORMAL;
                break;
            case GAMEMODE.P1_VS_BOT:
                if (this.currentPlayer === PLAYERS.WHITE)
                    this.gameStatus = GAMESTATE.BOT_PLAY;
                else
                    this.gameStatus = GAMESTATE.NORMAL;
                break;
            case GAMEMODE.BOT_VS_BOT:
                this.gameStatus = GAMESTATE.BOT_PLAY;
                break;
        }
    }

    getValidMoves(data){
        var validMoves = JSON.parse(data.target.response);
        console.log(validMoves);
        this.validMoves = [];
        var index = 0;
        for(let coord of validMoves){
            if(coord[0] == 0)
            var aux = ((coord[1] + 1) * ((coord[0]*5) + 1));
            else{
            var aux = ((coord[1] + 1) + ((coord[0]*5)));
            }
            this.validMoves[index] = aux;
            index++;
            
        }
        this.validMoves.sort(sortNumber);
        console.log(this.validMoves);
    }

    picked(pickedObj) {

        console.log('SIM',this.gameStatus);
        if(this.gameStatus === GAMESTATE.NOT_RUNNING || this.gameStatus === GAMESTATE.BOT_PLAY || this.gameStatus === GAMESTATE.GAME_OVER || this.gameStatus === GAMESTATE.REPLAY){
            return;
        }



        if (pickedObj[0].pick != null && pickedObj[0].pick === 'board' && this.gameStatus === GAMESTATE.PLACE_PIECE) {
            var index;
            if((this.validMoves.indexOf(pickedObj[1])) != -1){
        
                this.validMoves = [];
                this.pieceFocus.x = this.sceneBoard.coords[pickedObj[1]-1].x + 1 + this.sceneBoard.width; //alterar
                this.pieceFocus.y = this.sceneBoard.coords[pickedObj[1]-1].y + 2.8 ; //alterar
                this.pieceFocus.z= this.sceneBoard.coords[pickedObj[1]-1].z + 1 + this.sceneBoard.heigh; //alterar
            }
            

        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'white' ) {

            if(this.gameStatus === GAMESTATE.NORMAL && this.currentPlayer === PLAYERS.WHITE){
                this.pieceFocus = pickedObj[0];
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                getValidMoves(this.board,1,this.getValidMoves.bind(this));
            }else{
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }
            
          


        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'black') {
            if(this.gameStatus === GAMESTATE.NORMAL && this.currentPlayer === PLAYERS.BLACK){
                this.pieceFocus = pickedObj[0];
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                getValidMoves(this.board,2,this.getValidMoves.bind(this));
            }else{
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }

            

        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'mix') {
            if(this.gameStatus === GAMESTATE.NORMAL && pickedObj[0].player === this.currentPlayer){
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                this.pieceFocus = pickedObj[0];
                getValidMoves(this.board,3,this.getValidMoves.bind(this));
            }else {
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }
                

            

        }
    }

    update(deltaTime) {
        if (this.gameStatus === GAMESTATE.NOT_RUNNING)
            return;

        if (this.gameStatus == GAMESTATE.NORMAL) {

        }

    }

    display(){
        for(let i = 0; i < this.sceneBlackPieces.length; i++){
            this.scene.pushMatrix();
            this.scene.registerForPick((i+1+25),this.sceneBlackPieces[i]);
            this.sceneBlackPieces[i].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }
        for(let i = 0; i < this.sceneWhitePieces.length; i++){
            this.scene.pushMatrix();
            this.scene.registerForPick((i+1+35),this.sceneWhitePieces[i]);
            this.sceneWhitePieces[i].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }

        for(let i = 0; i < this.sceneMixPieces.length; i++){
            this.scene.pushMatrix();
            this.scene.registerForPick((i+1+45),this.sceneMixPieces[i]);
            this.sceneMixPieces[i].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }

        
    }

}


GAMESTATE = {
    NOT_RUNNING: -1,
    NORMAL: 0,
    PLACE_PIECE: 1,
    GAME_OVER: 3,
    BOT_PLAY: 4,
    REPLAY: 5
};

GAMEMODE = {
    P1_VS_P2: 0,
    P1_VS_BOT: 1,
    BOT_VS_BOT: 2
};

BOT_DIFFICULTY = {
    EASY: 0,
    NORMAL: 1
};

PLAYERS = {
    WHITE: 0,
    BLACK: 1
};