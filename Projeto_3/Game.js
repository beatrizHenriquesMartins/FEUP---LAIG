class Game{
    /**
     * Constructor for the Game classe, initializes the prolog Handler
     */
    constructor(){
        this.PrologHandler = new PrologHandler(8081);
        this.gameStatus = GAMESTATE.NOT_RUNNING;

    }
    /**
     * Sets new game scene, reset game state, sets gameMode.
     * @param {*} scene 
     * @param {*} gameMode 
     */
    newGame(scene,gameMode){
        this.gameStatus = GAMESTATE.NOT_RUNNING;
        this.scene = scene;
        this.gameMode = gameMode;
        this.currentPlayer = PLAYERS.WHITE;
        this.botIsPlaying = false;
        this.lastMoves = [];
        this.difficulties = [BOT_DIFFICULTY.EASY,BOT_DIFFICULTY.NORMAL];
    }
}


GAMESTATE = {
    NOT_RUNNING : -1,
    NORMAL : 0,
    PLACE_PIECE: 1,
    GAME_OVER : 3,
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