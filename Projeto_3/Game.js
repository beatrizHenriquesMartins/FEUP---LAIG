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
        this.focusedPieces = [];
        this.board;
        this.gameMode;
        this.flag = 0;
        this.createPieces();

    }
    /**
     * Sets new game scene, reset game state, sets gameMode.
     * @param {*} scene 
     * @param {*} gameMode 
     */
    newGame(gameMode,botDif) {
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.gameMode = gameMode;
        this.pieces = [];
        this.movements = [];
        this.scores = [];
        this.currentPlayer = PLAYERS.WHITE;
        this.botIsPlaying = false;
        this.lastMoves = [];
        this.difficulties = [botDif, BOT_DIFFICULTY.NORMAL];
    }

    startGame() {

        initializeVariables(this.getBoard.bind(this));

        this.updateAuxVars();
        if (this.gameMode == GAMEMODE.BOT_VS_BOT) {
            this.gameMode = GAMEMODE.BOT_VS_BOT;
            this.gameStatus = GAMESTATE.FIRST_MOVE;
        } else {
            if (this.gameMode == GAMEMODE.P1_VS_BOT) {
                this.gameMode = GAMEMODE.P1_VS_BOT;
            } else 
                this.gameMode = GAMEMODE.P1_VS_P2;
            this.gameStatus = GAMESTATE.FIRST_MOVE;
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
                if(this.currentPlayer == PLAYERS.WHITE)
                    return 'White Player turn! Choose a piece to move';
                else
                    return 'Black Player turn! Choose a piece to move';
            case GAMESTATE.PLACE_PIECE:
                return "Select the tile to move the piece";

            case GAMESTATE.GAME_OVER:
                return "Game Over!";
            case GAMESTATE.FIRST_MOVE:
                return "White Player choose where to place the first Henge Piece";
            default:
                return "...";
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
            this.sceneBlackPieces[i] = new MyPiece(this.scene,(i/2.0)+17,2.83,16,'black');
        }
    }

    createWhitePieces(){
        this.sceneWhitePieces = [];
        for(var i = 0; i < 10; i++){
            this.sceneWhitePieces[i] = new MyPiece(this.scene,(i/2.0)+17,2.83,7+17,'white'); 
        }
    }

    createMixPieces(){
        this.sceneMixPieces = [];
        for(var i = 0; i <5; i++){
            if(i <= 2){
                this.sceneMixPieces[i] = new MyPiece(this.scene,((i+10)/2.0)+17,2.83,7+17,'mix');
                this.sceneMixPieces[i].player = PLAYERS.WHITE;
            }
          
            else{
                this.sceneMixPieces[i] = new MyPiece(this.scene,((i+7)/2.0)+17,2.83,16,'mix');
                this.sceneMixPieces[i].player = PLAYERS.BLACK;
            }
        }
    }

    updateGameState() {
        switch (this.gameMode) {
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

    nextPlayer(flag){
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        if(flag == 1)
        this.scene.changeCamera();
    }

    compareBoard(data){
        var newBoard = JSON.parse(data.target.response);
        console.log(newBoard);
        for(var i = 0; i < this.board.length;i++){
            for(var j = 0; j < this.board[i].length;j++){
                if(newBoard[i][j] != 0 && this.board[i][j] == 0){
                    this.pieceFocus.setBezierPoints();
                    this.gameStatus = GAMESTATE.MOVEMENT
                }else if(newBoard[i][j] == 0 && this.board[i][j] != 0){
                    (this.getPieceInBoard(i,j)).setRemovalPoints(i,j);
                    this.gameStatus = GAMESTATE.MOVEMENT;
                }
            }
        }
        this.setBoard(newBoard);
    }

    compareBoardBot(data){
        var newBoard = JSON.parse(data.target.response);

        for(var i = 0; i < this.board.length;i++){
            for(var j = 0; j < this.board[i].length;j++){
                var aux = newBoard[i][j];
                if(aux != 0 && this.board[i][j] == 0){
                    this.pieceFocus = getRandomPieceType(aux);
                    this.pieceFocus.setBezierPoints();
                    this.pieceFocus.isUsable = false;
                    this.gameStatus = GAMESTATE.MOVEMENT;
                }else if(aux == 0 && this.board[i][j] !=0){
                    (this.getPieceInBoard(i,j)).setRemovalPoints(i,j);
                    this.gameStatus = GAMESTATE.MOVEMENT;
                }
            }
        }
    }

    getRandomPieceType(type){
        if(type == 3){
            for(let i = 0; i <this.sceneMixPieces;i++){
                if(this.sceneMixPieces[i].isUsable == true && this.sceneMixPieces[i].player == this.currentPlayer){
                    return this.sceneMixPieces[i];
                }
            }
        }else if(type == 2){
            for(let i = 0; i <this.sceneBlackPieces;i++){
                if(this.sceneBlackPieces[i].isUsable == true) {
                    return this.sceneBlackPieces[i];
                }
            }
        }else if(type == 1){
            for(var i = 0; i <this.sceneWhitePieces;i++){
                if(this.sceneWhitePieces[i].isUsable == true) {
                    return this.sceneWhitePieces[i];
                }
            }
        }
    }

    getPieceInBoard(Row,Col){
        for(var i = 0; i < this.sceneBlackPieces.length; i++){
           /* if(i <= 4){

                var mixPieceAux;
                if(Row == 0)
                    mixPieceAux = ((Col + 1) * ((Row*5) + 1))
                else mixPieceAux = ((Col + 1) + ((Row*5)))
                if(this.sceneMixPieces[i].placedBoardIndex == mixPieceAux)
                    return this.sceneMixPieces[i];
            }*/
            var blackPieceAux;
            if(Row == 0)
                blackPieceAux = ((Col + 1) * ((Row*5) + 1));
            else 
                blackPieceAux = ((Col + 1) + ((Row*5)));
            if(this.sceneBlackPieces[i].placedBoardIndex == blackPieceAux)
                return this.sceneBlackPieces[i];
            if(this.sceneWhitePieces[i].placedBoardIndex == blackPieceAux)
                return this.sceneWhitePieces[i];

        }
    }

    updateScore(){
        let scores = document.getElementsByClassName('score');

        scores[0].innerHTML = this.whiteScore;
        scores[1].innerHTML = this.blackScore;
    }

    updateOverlay(){
        document.getElementById('log').innerHTML = this.getGameStatus();
    }

    startOverlay(){
        document.getElementById('overlay').style.display = 'block';
        let scores = document.getElementsByClassName('score');

        scores[0].innerHTML = 0;
        scores[1].innerHTML = 0;
    }

    picked(pickedObj) {

        if(this.gameStatus === GAMESTATE.NOT_RUNNING || this.gameStatus === GAMESTATE.BOT_PLAY || this.gameStatus === GAMESTATE.GAME_OVER || this.gameStatus === GAMESTATE.REPLAY){
            return;
        }

        if (pickedObj[0].pick != null && pickedObj[0].pick === 'board' && this.gameStatus === GAMESTATE.FIRST_MOVE){
            
                this.validMoves = [];
                this.focusedPieces.unshift(this.pieceFocus);
                this.pieceFocus.isUsable = false;
                this.pieceFocus.placedBoardIndex = pickedObj[1];
                this.pieceFocus.targetx = this.sceneBoard.coords[pickedObj[1]-1].x + 17 + this.sceneBoard.width; //alterar
                this.pieceFocus.targety = this.sceneBoard.coords[pickedObj[1]-1].y + 2.8 ; //alterar
                this.pieceFocus.targetz= this.sceneBoard.coords[pickedObj[1]-1].z + 17 + this.sceneBoard.heigh;
                var row = Math.floor((pickedObj[1]-1)/5);
                var column = (pickedObj[1]-1) % 5;
                processMovement(this.board,row,column,this.currentPlayer+1,this.pieceFocus.transPiece(),this.compareBoard.bind(this));
                this.updateAuxVars();
            
        }

        if (pickedObj[0].pick != null && pickedObj[0].pick === 'board' && this.gameStatus === GAMESTATE.PLACE_PIECE) {
            var index;
            if((this.validMoves.indexOf(pickedObj[1])) != -1){
        
                this.validMoves = [];
                this.focusedPieces.unshift(this.pieceFocus);
                this.pieceFocus.placedBoardIndex = pickedObj[1];
                this.pieceFocus.targetx = this.sceneBoard.coords[pickedObj[1]-1].x + 17 + this.sceneBoard.width; //alterar
                this.pieceFocus.targety = this.sceneBoard.coords[pickedObj[1]-1].y + 2.8 ; //alterar
                this.pieceFocus.targetz= this.sceneBoard.coords[pickedObj[1]-1].z + 17 + this.sceneBoard.heigh;
                var row = Math.floor((pickedObj[1]-1)/5);
                var column = (pickedObj[1]-1) % 5;
                console.log('ROW COL',row,column);
                processMovement(this.board,row,column,this.currentPlayer+1,this.pieceFocus.transPiece(),this.compareBoard.bind(this));
                this.updateAuxVars();
                //this.pieceFocus.setBezierPoints();
            }
            

        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'white' && this.gameStatus === GAMESTATE.NORMAL) {

            if(this.gameStatus === GAMESTATE.NORMAL && this.currentPlayer === PLAYERS.WHITE){
                this.pieceFocus = pickedObj[0];
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                getValidMoves(this.board,1,this.getValidMoves.bind(this));
            }else{
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }
            
          


        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'black' && this.gameStatus === GAMESTATE.NORMAL) {
            if(this.gameStatus === GAMESTATE.NORMAL && this.currentPlayer === PLAYERS.BLACK){
                this.pieceFocus = pickedObj[0];
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                getValidMoves(this.board,2,this.getValidMoves.bind(this));
            }else{
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }

            

        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'mix' && this.gameStatus === GAMESTATE.NORMAL) {
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

    isAnimationHappening(){
        for(var i = 0; i < this.sceneBlackPieces.length;i++){
            if(i <= 4){
                if(this.sceneMixPieces[i].animate == true)
                    return true;
                
            }
            if(this.sceneBlackPieces[i].animate == true)
                    return true;
                if(this.sceneWhitePieces[i].animate == true)
                    return true;
        }
    }

    update(deltaTime) {
        if (this.gameStatus === GAMESTATE.NOT_RUNNING)
            return;

        this.updateScore();
        this.updateOverlay();

        this.flag++;
       /* if(this.flag == 5){
            processBotMovement(this.difficulties[0],this.board,this.currentPlayer,function (data) {
                console.log(data);
            });
        }*/
        console.log(this.gameStatus);
        if(this.gameStatus === GAMESTATE.FIRST_MOVE){
            this.pieceFocus = this.sceneMixPieces[2];
        }

        if(this.gameMode == GAMEMODE.BOT_VS_BOT && this.gameStatus == GAMESTATE.FIRST_MOVE){
            this.pieceFocus = this.sceneMixPieces[2];
            botFirstMove(this.board,this.compareBoard.bind(this));
        }

        if(this.gameStatus === GAMESTATE.BOT_PLAY){
           processBotMovement(this.difficulties[0],this.board,this.currentPlayer,this.compareBoardBot.bind(this));
        }


        if(this.gameStatus === GAMESTATE.MOVEMENT){
            if(!this.isAnimationHappening()){
                this.updateGameState();
               if(this.gameMode == GAMEMODE.P1_VS_P2)
                this.nextPlayer(1);
                else this.nextPlayer(0);   
            }
        }

        for(var i = 0; i < this.sceneBlackPieces.length; i++){
            if(i <= 4){
                this.sceneMixPieces[i].update(deltaTime);
            }
            this.sceneBlackPieces[i].update(deltaTime);
            this.sceneWhitePieces[i].update(deltaTime);
        }

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
    FIRST_MOVE: 0,
    NORMAL: 1,
    MOVEMENT: 2,
    PLACE_PIECE: 3,
    GAME_OVER: 4,
    BOT_PLAY: 5,
    REPLAY: 6
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

PIECES = {
    WHITE: 1,
    BLACK: 2,
    MIX: 3

};