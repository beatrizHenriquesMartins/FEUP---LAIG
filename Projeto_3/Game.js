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

        var index = 0;
        for(let coord of validMoves){
            if(coord[0] == 0)
            var aux = ((coord[1] + 1) * ((coord[0]*5) + 1));
            else{
            var aux = ((coord[1] + 1) + ((coord[0]*5)));
            }
            this.validMoves[index] = aux;
            index++;
            console.log(aux);
        }
    }

    picked(pickedObj) {

        console.log('SIM',this.gameStatus);
        if(this.gameStatus === GAMESTATE.NOT_RUNNING || this.gameStatus === GAMESTATE.BOT_PLAY || this.gameStatus === GAMESTATE.GAME_OVER || this.gameStatus === GAMESTATE.REPLAY){
            return;
        }



        if (pickedObj[0].pick != null && pickedObj[0].pick === 'board' && this.gameStatus === GAMESTATE.PLACE_PIECE) {


        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'white' ) {
            if(this.gameStatus === GAMESTATE.NORMAL){
                this.gameStatus == GAMESTATE.PLACE_PIECE;
            }
            
            getValidMoves(this.board,1,this.getValidMoves.bind(this));


        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'black') {

            if(this.gameStatus === GAMESTATE.NORMAL){
                this.gameStatus == GAMESTATE.PLACE_PIECE;
            }

            getValidMoves(this.board,2,this.getValidMoves.bind(this));

        } else if (pickedObj[0].type_piece != null && pickedObj[0].type_piece === 'mix') {

            if(this.gameStatus === GAMESTATE.NORMAL){
                this.gameStatus == GAMESTATE.PLACE_PIECE;
            }

            getValidMoves(this.board,3,this.getValidMoves.bind(this));

        }
    }

    update(deltaTime) {
        if (this.gameStatus === GAMESTATE.NOT_RUNNING)
            return;

        if (this.gameStatus == GAMESTATE.NORMAL) {

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