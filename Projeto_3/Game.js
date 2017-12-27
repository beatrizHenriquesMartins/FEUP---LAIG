class Game {
    /**
     * Constructor for the Game classe, initializes the prolog Handler
     */
    constructor() {
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.boards = [];
        this.movements = [];
        this.whitePieces = [];
        this.BlackPieces = [];
        this.board;

    }
    /**
     * Sets new game scene, reset game state, sets gameMode.
     * @param {*} scene 
     * @param {*} gameMode 
     */
    newGame(scene, gameMode) {
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.scene = scene;
        this.gameMode = gameMode;
        this.currentPlayer = PLAYERS.WHITE;
        this.botIsPlaying = false;
        this.lastMoves = [];
        this.difficulties = [BOT_DIFFICULTY.EASY, BOT_DIFFICULTY.NORMAL];
    }

    startGame() {

        initializeVariables(this.getBoard.bind(this));
        getScore(PLAYERS.WHITE,this.getScores.bind(this,PLAYERS.WHITE));
        getScore(PLAYERS.BLACK,this.getScores.bind(this,PLAYERS.BLACK));
        if (this.gameMode == GAMEMODE.BOT_VS_BOT) {
            this.gameMode = GAMEMODE.BOT_VS_BOT;
            this.gameStatus = GAMESTATE.BOT_PLAY;
        } else {
            if (this.gameMode == GAMEMODE.P1_VS_BOT) {
                this.gameMode == GAMEMODE.P1_VS_BOT;
            } else this.gameMode == GAMEMODE.P1_VS_P2;
            this.gameStatus == GAMESTATE.NORMAL;
        }

        this.timeSinceLastPlay = 0;
        this.fullGameTime = 0;

    }


    setBoard(board){
        if(this.board != null){
            this.boards.unshift(this.board);
        }
        this.board = board;
    }

    setScore(Score,Player){
        if(Player == PLAYERS.WHITE){
            this.whiteScore = Score;
        }else{
            this.blackScore = Score;
        }
    }

    getBoard(data){
        
        this.setBoard(JSON.parse(data.target.response));
    }

    getScores(Player,data){
      this.setScore(JSON.parse(data.target.response),Player);
    }

    update(currTime){
        
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