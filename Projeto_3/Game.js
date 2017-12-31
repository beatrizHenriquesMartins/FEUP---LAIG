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
     * @param {*} gameMode game to be played 
     * @param {*} botDif difficulty of the bots
     */
    newGame(gameMode, botDif) {
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.gameMode = gameMode;
        this.board = [];
        this.boards = [];
        this.pieces = [];
        this.movements = [];
        this.whitePieces = [];
        this.blackPieces = [];
        this.focusedPieces = [];
        this.boardsIndex = 0;
        this.pieceFocus = null;
        this.scores = [];
        this.currentPlayer = PLAYERS.WHITE;
        this.botIsPlaying = false;
        this.lastMoves = [];
        this.whiteScore = 0;
        this.blackScore = 0;
     
        this.difficulties = [botDif, BOT_DIFFICULTY.NORMAL];
        console.log('DIFICULDADE',this.difficulties);
    }

    /**
     * Starts all the necessary parameter to create start game,such as pieces, board and gameStatus
     */
    startGame() {
        this.winner = null;
        this.turnCounter = 0;
        this.createPieces();
        initializeVariables(this.getBoard.bind(this));
       
        this.updateAuxVars();
        if (this.gameMode == GAMEMODE.BOT_VS_BOT) {
            this.gameMode = GAMEMODE.BOT_VS_BOT;
            this.gameStatus = GAMESTATE.FIRST_MOVE;
            this.botIsPlaying = true;
        } else {
            if (this.gameMode == GAMEMODE.P1_VS_BOT) {
                this.gameMode = GAMEMODE.P1_VS_BOT;
                this.botIsPlaying = true;
            } else
                this.gameMode = GAMEMODE.P1_VS_P2;
            this.gameStatus = GAMESTATE.FIRST_MOVE;
        }


        this.timeSinceLastPlay = 0;
        this.fullGameTime = 0;


    }

    /**
     * Updates the board parameter saving the previoues one in the stack
     * @param {*} board newboard to update
     */
    setBoard(board) {
        if (this.board != null) {
            this.boards.unshift(this.board);
        }

        this.board = board;
    }
    /**
     * Updates the player score parameter 
     * @param {*} Score the new score to update
     * @param {*} Player the player that has that score
     */
    setScore(Score, Player) {
     

        if (Player == PLAYERS.WHITE) {
            this.whiteScore = Score;
        } else {
            this.blackScore = Score;
        }
    }

    /**
     * Saves each player available pieces
     * @param {*} Pieces the new pieces list to update
     * @param {*} Player the player which the pieces are associated
     */
    setPlayerPieces(Pieces, Player) {

        if (Player == PLAYERS.WHITE) {
            this.whitePieces = Pieces;
        } else {
            this.blackPieces = Pieces;
        }
    }

    /**
     * Updates de board
     * @param {*} data 
     */
    getBoard(data) {

        this.setBoard(JSON.parse(data.target.response));
    }

    /**
     * Updates the player score
     * @param {*} Player 
     * @param {*} data 
     */
    getScores(Player, data) {
        this.setScore(JSON.parse(data.target.response), Player);
    }

    /**
     * Updates each player pieces list
     * @param {*} Player 
     * @param {*} data 
     */
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

    /**
     * Request the prolog application the auxiliary variable so that they can be update, like score and pieces available
     */
    updateAuxVars() {
        getScore(PLAYERS.WHITE, this.getScores.bind(this, PLAYERS.WHITE));
        getScore(PLAYERS.BLACK, this.getScores.bind(this, PLAYERS.BLACK));
        if (this.blackScore != null && this.whiteScore != null) {
            this.scores.unshift({
                white: this.whiteScore,
                black: this.blackScore
            });
        }
        getPieces(PLAYERS.WHITE, this.getPieces.bind(this, PLAYERS.WHITE));
        getPieces(PLAYERS.BLACK, this.getPieces.bind(this, PLAYERS.BLACK));
        if (this.whitePieces != [] && this.blackPieces != []) {
            this.pieces.unshift({
                white: this.whitePieces,
                black: this.blackPieces
            });
        }

    }

    /**
     * Returns a simple text for each game state
     */
    getGameStatus() {
        switch (this.gameStatus) {
            case GAMESTATE.NORMAL:
                if (this.currentPlayer == PLAYERS.WHITE)
                    return 'White Player turn! Choose a piece to move';
                else
                    return 'Black Player turn! Choose a piece to move';
            case GAMESTATE.PLACE_PIECE:
                return "Select the tile to move the piece";

            case GAMESTATE.GAME_OVER:
                if(this.winner == PLAYERS.WHITE){
                    return 'White player is the winner!!';
                }else
                    return 'Black player is the winner!!';
            case GAMESTATE.FIRST_MOVE:
                return "White Player choose where to place the first Henge Piece";
            case GAMESTATE.REPLAY:
                return "REPLAYING...";
            case GAMESTATE.PAUSE:
                return "Game Paused";
            case GAMESTATE.REPLAY_MOVEMENT:
                return "REPLAYING...";
            case GAMESTATE.BOT_PLAY:
                if(this.currentPlayer == PLAYERS.WHITE)
                    return 'Is white bot turn!';
                else 
                    return 'Is black bot turn!';
            default:
                return "...";
        }
    }

    /**
     * Creates all the pieces in the scene
     */
    createPieces() {
        this.createBlackPieces();
        this.createWhitePieces();
        this.createMixPieces();
    }

    /**
     * creates all black pieces in the scene
     */
    createBlackPieces() {
        this.sceneBlackPieces = [];
        for (var i = 0; i < 10; i++) {
            this.sceneBlackPieces[i] = new MyPiece(this.scene, (i / 2.0) + 17, 2.83, 16, 'black');
            this.sceneBlackPieces[i].placedBoardIndex = null;
            this.sceneBlackPieces[i].player = PLAYERS.BLACK;

        }
    }
/**
 * Creates all white pieces in the scene
 */
    createWhitePieces() {
        this.sceneWhitePieces = [];
        for (var i = 0; i < 10; i++) {
            this.sceneWhitePieces[i] = new MyPiece(this.scene, (i / 2.0) + 17, 2.83, 7 + 17, 'white');
            this.sceneWhitePieces[i].placedBoardIndex = null;
            this.sceneWhitePieces[i].player = PLAYERS.WHITE;
        }
    }

    /**
     * Creates all henge pieces in the scene with the player owner associated
     */
    createMixPieces() {
        this.sceneMixPieces = [];
        for (var i = 0; i < 5; i++) {
            if (i <= 2) {
                this.sceneMixPieces[i] = new MyPiece(this.scene, ((i + 10) / 2.0) + 17, 2.83, 7 + 17, 'mix');
                this.sceneMixPieces[i].placedBoardIndex = null;
                this.sceneMixPieces[i].player = PLAYERS.WHITE;
            } else {
                this.sceneMixPieces[i] = new MyPiece(this.scene, ((i + 7) / 2.0) + 17, 2.83, 16, 'mix');
                this.sceneMixPieces[i].placedBoardIndex = null;
                this.sceneMixPieces[i].player = PLAYERS.BLACK;
            }
        }
    }

    /**
     * Updates the game State
     */
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

    /**
     * Asks the prolog application to get the possible moves the player can make
     * @param {*} data response from prolog with all indexes of the board where the piece can be placed
     */
    getValidMoves(data) {
        var validMoves = JSON.parse(data.target.response);
        console.log(validMoves);
        this.validMoves = [];
        var index = 0;
        for (let coord of validMoves) {
            if (coord[0] == 0)
                var aux = ((coord[1] + 1) * ((coord[0] * 5) + 1));
            else {
                var aux = ((coord[1] + 1) + ((coord[0] * 5)));
            }
            this.validMoves[index] = aux;
            index++;

        }
        this.validMoves.sort(sortNumber);
        console.log(this.validMoves);
    }

    /**
     * Changes the player playing
     * @param {*} flag flag to see if a camera change is necessary
     */
    nextPlayer(flag) {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        if (flag == 1)
            this.scene.changeCamera();
    }

    /**
     * Compares in normal PVP the current board with the new board to see what pieces were moved and where to
     * @param {*} data 
     */
    compareBoard(data) {
        var newBoard = JSON.parse(data.target.response);
        console.log(newBoard);
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                if (newBoard[i][j] != 0 && this.board[i][j] == 0) {
                    this.pieceFocus.setBezierPoints();
                    this.gameStatus = GAMESTATE.MOVEMENT
                } else if (newBoard[i][j] == 0 && this.board[i][j] != 0) {
                    (this.getPieceInBoard(i, j)).setRemovalPoints(i, j);
                    this.gameStatus = GAMESTATE.MOVEMENT;
                }
            }
        }
        this.setBoard(newBoard);
    }

    /**
     * Makes replay of the game until now
     */
    replay(){
        if(this.boards[this.boardsIndex] == [] || this.boardsIndex == 0){
            this.scene.initCameras();
            this.gameStatus = this.previousState;
            return;
        }
            

        var currentBoard = this.boards[this.boardsIndex];
        for(var row = 0; row < currentBoard.length; row++){
            for(var col = 0; col < currentBoard[row].length; col++){
                if(currentBoard[row][col] == 0 && this.boards[this.boardsIndex-1][row][col] != 0){
                    var piece = this.focusedPieces[this.focusIndex];
                    piece.setBezierPoints();
                    this.gameStatus = GAMESTATE.REPLAY_MOVEMENT;
                }else if(currentBoard[row][col] != 0 && this.boards[this.boardsIndex-1][row][col] == 0){
                    (this.getPieceInBoard(row, col)).setRemovalPoints(row, col);
                    this.gameStatus = GAMESTATE.REPLAY_MOVEMENT;
                }
            }
        }
    }

    /**
     * Compares in BOT vs Bot when the bot puts randomly the henge where it was put
     * @param {*} data 
     */
    compareFirstBoard(data) {
        var newBoard = JSON.parse(data.target.response);
        console.log(newBoard);
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                if (newBoard[i][j] != 0 && this.board[i][j] == 0) {
                    this.focusedPieces.unshift(this.pieceFocus);
                    var aux;
                    if(i == 0)
                        aux = ((i + 1) * ((j*5) + 1))
                    else aux = ((i + 1) + ((j*5)))
                    this.pieceFocus.placedBoardIndex = aux;
                    this.pieceFocus.targetx = this.sceneBoard.coords[this.pieceFocus.placedBoardIndex - 1].x + 17 + this.sceneBoard.width; //alterar
                    this.pieceFocus.targety = this.sceneBoard.coords[this.pieceFocus.placedBoardIndex - 1].y + 2.8; //alterar
                    this.pieceFocus.targetz = this.sceneBoard.coords[this.pieceFocus.placedBoardIndex - 1].z + 17 + this.sceneBoard.heigh;
                    this.pieceFocus.setBezierPoints();
                    this.gameStatus = GAMESTATE.MOVEMENT
                    this.botIsPlaying = true;
                }
            }
        }
        this.setBoard(newBoard);
    }

    /**
     * Undo the most recent play, vulnerable to bugs
     */
    undo() {
        if (this.gameStatus == GAMESTATE.NORMAL || this.gameStatus == GAMESTATE.PLACE_PIECE) {
            var difference = false;
            if(this.boards.length > 1){
                this.turnCounter -=1;
                var currentBoard = this.board;
                this.board = this.boards.shift();
                var prevScores = this.scores.shift();
                this.whiteScore = prevScores.white;
                this.blackScore = prevScores.black;
                var prevPieces = this.pieces.shift();
                this.whitePieces = prevPieces.white;
                this.blackPieces = prevPieces.black; 
                changeScore(prevScores.white,prevScores.black);
                changePieces(prevPieces.white,prevPieces.black);
                for(var i = 0; i < currentBoard.length; i++){
                    for(var j = 0; j < currentBoard[i].length;j++){
                        if(currentBoard[i][j] == 0 && this.board[i][j] != 0){
                            var piece = this.getPieceInBoard(i,j);
                            difference = true;
                            piece.x = this.sceneBoard.coords[piece.placedBoardIndex - 1].x + 17 + this.sceneBoard.width; //alterar
                            piece.y = this.sceneBoard.coords[piece.placedBoardIndex - 1].y + 2.8; //alterar
                            piece.z = this.sceneBoard.coords[piece.placedBoardIndex - 1].z + 17 + this.sceneBoard.heigh;
                        }else if(currentBoard[i][j] != 0 && this.board[i][j] == 0){
                            var piece = this.getPieceInBoard(i,j);
                            difference = true;
                            console.log(piece);
                            piece.x = piece.originalX;
                            piece.y = piece.originalY;
                            piece.z = piece.originalZ;
                        }
                    }
                }
                if(difference){
                    this.updateGameState();
                    if (this.gameMode == GAMEMODE.P1_VS_P2)
                        this.nextPlayer(1);
                    else this.nextPlayer(0);

                }
          
                
            }
           
        }

    }

    /**
     * Compares the move of a bot with the current board to see which pieces to move
     * @param {*} data 
     */
    compareBoardBot(data) {
        var newBoard = JSON.parse(data.target.response);
        console.log(this.board);
        console.log(newBoard);
        var ind = 0;
        for (var row = 0; row < this.board.length; row++) {
            console.log('LINHA',this.board[row]);
            for (var col = 0; col < this.board[row].length; col++) {
                
                console.log('AUX' + ind + ' ' +newBoard[row][col] + ' VS BOARD ' + this.board[row][col]);
                ind++;
                if (newBoard[row][col] != 0 && this.board[row][col] == 0) {
                    console.log('ENTROU AQUI QUANTAS VEZES');
                    this.pieceFocus = this.getRandomPieceType(newBoard[row][col]);
                    console.log(this.pieceFocus);
                    this.focusedPieces.unshift(this.pieceFocus);
                    var aux;
                    if(row == 0)
                        aux = ((col + 1) * ((row*5) + 1))
                    else aux = ((col + 1) + ((row*5)))
                    this.pieceFocus.placedBoardIndex = aux;
                    this.pieceFocus.targetx = this.sceneBoard.coords[this.pieceFocus.placedBoardIndex - 1].x + 17 + this.sceneBoard.width; //alterar
                    this.pieceFocus.targety = this.sceneBoard.coords[this.pieceFocus.placedBoardIndex - 1].y + 2.8; //alterar
                    this.pieceFocus.targetz = this.sceneBoard.coords[this.pieceFocus.placedBoardIndex - 1].z + 17 + this.sceneBoard.heigh;
                    this.pieceFocus.setBezierPoints();
                    this.pieceFocus.isUsable = false;
                    this.gameStatus = GAMESTATE.MOVEMENT;
                } else if (newBoard[row][col] == 0 && this.board[row][col] != 0) {
                    (this.getPieceInBoard(row, col)).setRemovalPoints(row, col);
                    this.gameStatus = GAMESTATE.MOVEMENT;
                }
            }
        }
        this.botIsPlaying = true;
        this.setBoard(newBoard);
    }

    /**
     * Returns the first available pieces of the type for the specific player
     * @param {*} type 1 - white piece 2-black 3-henge
     */
    getRandomPieceType(type) {
        if (type == 3) {
            for (let i = 0; i < this.sceneMixPieces.length; i++) {
                if (this.sceneMixPieces[i].isUsable == true && this.sceneMixPieces[i].player == this.currentPlayer) {
                    return this.sceneMixPieces[i];
                }
            }
        } else if (type == 2) {

            for (let i = 0; i < this.sceneBlackPieces.length; i++) {
                if (this.sceneBlackPieces[i].isUsable == true) {
                    return this.sceneBlackPieces[i];
                }
            }
        } else if (type == 1) {
            for (let i = 0; i < this.sceneWhitePieces.length; i++) {
                if (this.sceneWhitePieces[i].isUsable == true) {
                    return this.sceneWhitePieces[i];
                }
            }
        }
    }

    /**
     * Returns the object piece in the scene placed in the board position
     * @param {*} Row number of row of the board ,index start on 0
     * @param {*} Col number of the column of the board, index start on 0
     */
    getPieceInBoard(Row, Col) {
        for (var i = 0; i < this.sceneBlackPieces.length; i++) {
             if(i <= 4){

                 var mixPieceAux;
                 if(Row == 0)
                     mixPieceAux = ((Col + 1) * ((Row*5) + 1))
                 else mixPieceAux = ((Col + 1) + ((Row*5)))
                 if(this.sceneMixPieces[i].placedBoardIndex == mixPieceAux)
                     return this.sceneMixPieces[i];
             }
            var blackPieceAux;
            if (Row == 0)
                blackPieceAux = ((Col + 1) * ((Row * 5) + 1));
            else
                blackPieceAux = ((Col + 1) + ((Row * 5)));
            if (this.sceneBlackPieces[i].placedBoardIndex == blackPieceAux)
                return this.sceneBlackPieces[i];
            if (this.sceneWhitePieces[i].placedBoardIndex == blackPieceAux)
                return this.sceneWhitePieces[i];

        }
    }

    /**
     * Updates in the log html div the current player score
     */
    updateScore() {
        let scores = document.getElementsByClassName('score');

        if(this.gameStatus == GAMESTATE.REPLAY || this.gameStatus == GAMESTATE.REPLAY_MOVEMENT){
            scores[0].innerHTML = this.scores[this.scoreIndex].white;
            scores[1].innerHTML = this.scores[this.scoreIndex].black;
        }else{
            scores[0].innerHTML = this.whiteScore;
            scores[1].innerHTML = this.blackScore;
        }
      
    }

    /**
     * Updates in the log html div the current turn counter and the game status log message
     */
    updateOverlay() {
        if(this.gameStatus == GAMESTATE.REPLAY || this.gameStatus == GAMESTATE.REPLAY_MOVEMENT){
            document.getElementById('counter').innerHTML = this.turnCounter;
        }else
        {
            document.getElementById('counter').innerHTML = this.turnCounter;
        }
        
        document.getElementById('log').innerHTML = this.getGameStatus();
    }

    /**
     * Initiates the log html div overlay
     */
    startOverlay() {
        document.getElementById('overlay').style.display = 'block';
        let scores = document.getElementsByClassName('score');

        scores[0].innerHTML = 0;
        scores[1].innerHTML = 0;
    }

    /**
     * Given an object that was picked check if the object was picked at the right to evolve the game (all accordingly to game state and current player)
     * for example picking a place in a board only tricks a player movement if the player previously picked a piece that belongs to the current player
     * @param {*} pickedObj the object picked (detected by webcgf pick)
     */
    picked(pickedObj) {

        if (this.gameStatus === GAMESTATE.NOT_RUNNING || this.gameStatus === GAMESTATE.BOT_PLAY || this.gameStatus === GAMESTATE.GAME_OVER || this.gameStatus === GAMESTATE.REPLAY || this.gameMode === GAMEMODE.BOT_VS_BOT) {
            return;
        }

        if (pickedObj[0].pick != null && pickedObj[0].pick === 'board' && this.gameStatus === GAMESTATE.FIRST_MOVE) {
            this.turnCounter +=1;
            this.validMoves = [];
            this.focusedPieces.unshift(this.pieceFocus);
            this.pieceFocus.isUsable = false;
            this.pieceFocus.placedBoardIndex = pickedObj[1];
            this.pieceFocus.targetx = this.sceneBoard.coords[pickedObj[1] - 1].x + 17 + this.sceneBoard.width; //alterar
            this.pieceFocus.targety = this.sceneBoard.coords[pickedObj[1] - 1].y + 2.8; //alterar
            this.pieceFocus.targetz = this.sceneBoard.coords[pickedObj[1] - 1].z + 17 + this.sceneBoard.heigh;
            var row = Math.floor((pickedObj[1] - 1) / 5);
            var column = (pickedObj[1] - 1) % 5;
            processMovement(this.board, row, column, this.currentPlayer + 1, this.pieceFocus.transPiece(), this.compareBoard.bind(this));
            this.updateAuxVars();

        }

        if (pickedObj[0].pick != null && pickedObj[0].pick === 'board' && this.gameStatus === GAMESTATE.PLACE_PIECE) {
            var index;
            if ((this.validMoves.indexOf(pickedObj[1])) != -1) {
                this.turnCounter +=1;
                this.validMoves = [];
                this.focusedPieces.unshift(this.pieceFocus);
                this.pieceFocus.placedBoardIndex = pickedObj[1];
                this.pieceFocus.targetx = this.sceneBoard.coords[pickedObj[1] - 1].x + 17 + this.sceneBoard.width; //alterar
                this.pieceFocus.targety = this.sceneBoard.coords[pickedObj[1] - 1].y + 2.8; //alterar
                this.pieceFocus.targetz = this.sceneBoard.coords[pickedObj[1] - 1].z + 17 + this.sceneBoard.heigh;
                var row = Math.floor((pickedObj[1] - 1) / 5);
                var column = (pickedObj[1] - 1) % 5;
                console.log('ROW COL', row, column);
                processMovement(this.board, row, column, this.currentPlayer + 1, this.pieceFocus.transPiece(), this.compareBoard.bind(this));
                this.updateAuxVars();
            }


        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'white' && this.gameStatus != GAMESTATE.FIRST_MOVE && this.gameStatus != GAMESTATE.BOT_PLAY) {

            if (this.gameStatus === GAMESTATE.NORMAL && this.currentPlayer === PLAYERS.WHITE) {
                this.pieceFocus = pickedObj[0];
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                getValidMoves(this.board, 1, this.getValidMoves.bind(this));
            } else {
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }




        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'black' && this.gameStatus != GAMESTATE.FIRST_MOVE && this.gameStatus != GAMESTATE.BOT_PLAY) {
            if (this.gameStatus === GAMESTATE.NORMAL && this.currentPlayer === PLAYERS.BLACK) {
                this.pieceFocus = pickedObj[0];
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                getValidMoves(this.board, 2, this.getValidMoves.bind(this));
            } else {
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }



        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'mix' && this.gameStatus != GAMESTATE.FIRST_MOVE && this.gameStatus != GAMESTATE.BOT_PLAY) {
            if (this.gameStatus === GAMESTATE.NORMAL && pickedObj[0].player === this.currentPlayer) {
                this.gameStatus = GAMESTATE.PLACE_PIECE;
                this.pieceFocus = pickedObj[0];
                getValidMoves(this.board, 3, this.getValidMoves.bind(this));
            } else {
                this.validMoves = [];
                this.gameStatus = GAMESTATE.NORMAL;
            }




        }
    }

  
    /**
     * Sees if any of the pieces are moving to a position
     */
    isAnimationHappening() {
        for (var i = 0; i < this.sceneBlackPieces.length; i++) {
            if (i <= 4) {
                if (this.sceneMixPieces[i].animate == true)
                    return true;

            }
            if (this.sceneBlackPieces[i].animate == true)
                return true;
            if (this.sceneWhitePieces[i].animate == true)
                return true;
        }
    }
    /**
     * Starts variables to start a replay
     */
    requestReplay(){

        if(this.boards.length >2){
            this.boards.unshift(this.board);
            this.scene.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10, 10, 10), vec3.fromValues(4, 1, 4));
            this.previousState = this.gameStatus;
            this.resetPieces();
            this.boardsIndex = this.boards.length - 2;
            this.focusIndex = this.focusedPieces.length -1;
            this.scoreIndex = this.scores.length -1;
            this.turnCounter = 0;
            this.gameStatus = GAMESTATE.REPLAY;
        }
     
    }

    /**
     * Update of the game 
     * @param {*} deltaTime 
     */
    update(deltaTime) {
        if (this.gameStatus === GAMESTATE.NOT_RUNNING || this.gameStatus === GAMESTATE.GAME_OVER || this.gameStatus === GAMESTATE.PAUSE)
            return;

        
        this.updateScore();
        this.updateOverlay();
        console.log(this.gameStatus);
        this.flag++;

        if(this.gameStatus === GAMESTATE.REPLAY && ((this.flag) % 20) == 0){
            this.replay();
        }

        if (this.gameStatus === GAMESTATE.REPLAY_MOVEMENT) {
            if (!this.isAnimationHappening()) {
                this.focusIndex -= 1;
                this.boardsIndex -= 1;
                this.scoreIndex -= 1;
                this.turnCounter++;
                this.gameStatus = GAMESTATE.REPLAY;
            }
        }

       

        if(this.gameStatus != GAMESTATE.GAME_OVER){
            this.checkTurnGameEnd();
           /* if(this.currentPlayer == PLAYERS.WHITE){
                checkGameEnd(this.board,'X',this.checkGameEnd.bind(this));
            }else if(this.currentPlayer == PLAYERS.BLACK){
                checkGameEnd(this.board,'O',this.checkGameEnd.bind(this));
            }*/
        }
      

        if (this.gameStatus === GAMESTATE.FIRST_MOVE) {
            this.pieceFocus = this.sceneMixPieces[2];
        }

        if (this.gameMode == GAMEMODE.BOT_VS_BOT && this.gameStatus == GAMESTATE.FIRST_MOVE && this.botIsPlaying == true && this.board.length > 1) {
            this.pieceFocus = this.sceneMixPieces[2];
            this.botIsPlaying = false;
            this.turnCounter++;
            botFirstMove(this.board, this.compareFirstBoard.bind(this));
            this.updateAuxVars();
        }

        if (this.gameStatus === GAMESTATE.BOT_PLAY && this.botIsPlaying == true && ((this.flag) % 30) == 0) {
            this.botIsPlaying = false;
            this.turnCounter++;
           processBotMovement(this.difficulties[0], this.board, this.currentPlayer+1, this.compareBoardBot.bind(this));
           this.updateAuxVars();
        }


        if (this.gameStatus === GAMESTATE.MOVEMENT) {
            if (!this.isAnimationHappening()) {
                this.updateGameState();
                if (this.gameMode == GAMEMODE.P1_VS_P2)
                    this.nextPlayer(1);
                else this.nextPlayer(0);
            }
        }

        for (var i = 0; i < this.sceneBlackPieces.length; i++) {
            if (i <= 4) {
                this.sceneMixPieces[i].update(deltaTime);
            }
            this.sceneBlackPieces[i].update(deltaTime);
            this.sceneWhitePieces[i].update(deltaTime);
        }

        if (this.gameStatus == GAMESTATE.NORMAL) {

        }

    }

    /**
     * Displays all the pieces in the scene
     */
    display() {
        for (let i = 0; i < this.sceneBlackPieces.length; i++) {
            this.scene.pushMatrix();
            this.scene.registerForPick((i + 1 + 25), this.sceneBlackPieces[i]);
            this.sceneBlackPieces[i].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }
        for (let i = 0; i < this.sceneWhitePieces.length; i++) {
            this.scene.pushMatrix();
            this.scene.registerForPick((i + 1 + 35), this.sceneWhitePieces[i]);
            this.sceneWhitePieces[i].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }

        for (let i = 0; i < this.sceneMixPieces.length; i++) {
            this.scene.pushMatrix();
            this.scene.registerForPick((i + 1 + 45), this.sceneMixPieces[i]);
            this.sceneMixPieces[i].display();
            this.scene.clearPickRegistration();
            this.scene.popMatrix();
        }


    }

    

    /**
     * Checks in the prolog if the current player looses in the middle of the game because of special circunstances
     * DEPRECATED because added a lot of bugs to the game
     * TODO fix
     * @param {*} data 
     */
    checkGameEnd(data){
        var res = data.target.response;
        if(res == 0){
            this.gameStatus = GAMESTATE.GAME_OVER;
            this.winner = (this.currentPlayer + 1) % 2;
            this.updateOverlay();
        }
    }

    /**
     * Sees in the end of the 25 turns who is the winner of the game
     */
    checkTurnGameEnd(){
        if(this.turnCounter >= 25){
            this.boards.unshift(this.board);
            console.log('TODOS OS BOARDs',this.boards);
            console.log('TODAS AS PIECES',this.sceneBlackPieces,this.sceneMixPieces,this.sceneWhitePieces);
            this.gameStatus = GAMESTATE.GAME_OVER;
            if(this.whiteScore == this.blackScore || this.whiteScore > this.blackScore){
                this.winner = PLAYERS.WHITE;
            }else{
                this.winner = PLAYERS.BLACK;
            }
            this.updateOverlay();
        }
    }
    /**
     * Resets all the scene pieces to the original positions
     */
    resetPieces(){
        for(let i = 0; i < this.sceneBlackPieces.length; i++){
            this.sceneBlackPieces[i].x = this.sceneBlackPieces[i].originalX;
            this.sceneBlackPieces[i].y = this.sceneBlackPieces[i].originalY;
            this.sceneBlackPieces[i].z = this.sceneBlackPieces[i].originalZ;
        }

        for(let i = 0; i < this.sceneWhitePieces.length; i++){
            this.sceneWhitePieces[i].x = this.sceneWhitePieces[i].originalX;
            this.sceneWhitePieces[i].y = this.sceneWhitePieces[i].originalY;
            this.sceneWhitePieces[i].z = this.sceneWhitePieces[i].originalZ;
        }

        for(let i= 0; i < this.sceneMixPieces.length; i++){
            this.sceneMixPieces[i].x = this.sceneMixPieces[i].originalX;
            this.sceneMixPieces[i].y = this.sceneMixPieces[i].originalY;
            this.sceneMixPieces[i].z = this.sceneMixPieces[i].originalZ;
        }
    }




}

/**
 * Various states of the game
 */
GAMESTATE = {
    NOT_RUNNING: -1,
    FIRST_MOVE: 0,
    NORMAL: 1,
    MOVEMENT: 2,
    PLACE_PIECE: 3,
    GAME_OVER: 4,
    BOT_PLAY: 5,
    REPLAY: 6,
    PAUSE: 7,
    REPLAY_MOVEMENT: 8
};
/**
 * Gamemodes of the game
 */
GAMEMODE = {
    P1_VS_P2: 0,
    P1_VS_BOT: 1,
    BOT_VS_BOT: 2
};

/**
 * 2 bot difficulties
 */
BOT_DIFFICULTY = {
    EASY: 0,
    NORMAL: 1
};

/**
 * 2 players
 */
PLAYERS = {
    WHITE: 0,
    BLACK: 1
};

/**
 * 3 pieces type
 */
PIECES = {
    WHITE: 1,
    BLACK: 2,
    MIX: 3

};