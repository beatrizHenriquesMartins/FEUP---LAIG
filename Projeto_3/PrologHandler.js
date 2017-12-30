/**
 * Sends a prolog request through ajax
 * @param {*} requestString request to send
 * @param {*} onSucess handler on success of request
 * @param {*} onError handler of error
 * @param {*} port PORT of the open server in prolog
 */
function getPrologRequest(requestString, onSucess, onError, port) {
    let requestPort = port || 8081; 
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);


    request.onload = onSucess || function (data) {
        console.log("Reques Sucessful. Reply: " + data.target.response);
    };
    request.onerror = onError || function () {
        console.log("Error waiting for response");
    };
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

/**
 * Default makeRequest to prolog with default handlers
 * @param {*} requestString 
 */
function makeRequest(requestString) {
    getPrologRequest(requestString, this.handleReply);
}

/**
 * Sucess handler only prints response
 * @param {*} data response received
 */
function handleReply(data) {
    console.log('DATA', data);
}

/**
 * Sends to the prolog a request to initialize the game variables
 * @param {*} callback on Success handler 
 */
function initializeVariables(callback) {
    let requestString = "startVars";
    getPrologRequest(requestString, callback);
}

/**
 * Ask the prolog to send the available moves
 * @param {*} board current board in game
 * @param {*} piece piece to evaluate valid moves
 * @param {*} callback on success handler
 */
function getValidMoves(board, piece, callback) {
    let requestString = 'getValidMovesMatrix(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(piece) + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Gets current player score
 * @param {*} Player player to get score
 * @param {*} callback success handler
 */
function getScore(Player, callback) {
    if (Player == PLAYERS.WHITE) {
        var requestString = 'scoreW';
    } else if (Player == PLAYERS.BLACK) {
        var requestString = 'scoreB';
    }

    getPrologRequest(requestString, callback);
}

/**
 * Gets the current available pieces of the player (deprecated)
 * @param {*} Player 
 * @param {*} callback 
 */
function getPieces(Player,callback){
    if (Player == PLAYERS.WHITE) {
        var requestString = 'piecesW';
    } else if (Player == PLAYERS.BLACK) {
        var requestString = 'piecesB';
    }

    getPrologRequest(requestString,callback);
}

/**
 * Checks if games end because of break of rules, not when all turns are meet
 * @param {*} board 
 * @param {*} playerLetter 
 * @param {*} callback 
 */
function checkGameEnd(board,playerLetter,callback){
    let requestString = 'checkGameEnd(' +
        JSON.stringify(board) + ',' +
        playerLetter + ')';
    getPrologRequest(requestString,callback);
}

/**
 * Processes a movement of a piece to the board
 * @param {*} board 
 * @param {*} row 
 * @param {*} col 
 * @param {*} player 
 * @param {*} piece 
 * @param {*} callback 
 */
function processMovement(board,row,col,player,piece,callback){
    let requestString = 'processMovement(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(row) + ',' +
        JSON.stringify(col) + ',' +
        JSON.stringify(player) + ',' +
        JSON.stringify(piece) + ')';
    
    getPrologRequest(requestString,callback);
}

/**
 * Ask the bot to randomly put the first henge piece in the board
 * @param {*} board 
 * @param {*} callback 
 */
function botFirstMove(board,callback){
    let requestString = 'setFirstPieceBot(' +
    JSON.stringify(board) + ')';

    getPrologRequest(requestString,callback);
}

/**
 * Requests the bot to make a movement
 * @param {*} BotDifficulty bot difficulty
 * @param {*} board 
 * @param {*} PlayerType 
 * @param {*} callback 
 */
function processBotMovement(BotDifficulty,board,PlayerType,callback){
    let requestString;
    if(BotDifficulty === BOT_DIFFICULTY.EASY){
        requestString = 'randomBotMovement(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(PlayerType) + ')';
    }else if(BotDifficulty === BOT_DIFFICULTY.NORMAL){
        requestString = 'inteligentBotPlay(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(PlayerType) + ')';
    }

    getPrologRequest(requestString,callback);
}

/**
 * Changes scored stored in prolog in case of undo
 * @param {*} whiteScore 
 * @param {*} blackScore 
 */
function changeScore(whiteScore,blackScore){
    let requestString = 'changeScore(' +
    JSON.stringify(whiteScore) + ',' +
    JSON.stringify(blackScore) + ')';

    getPrologRequest(requestString);
}


function changePieces(whitePieces,blackPieces){
    let requestString = 'changePieces(' + 
    JSON.stringify(whitePieces) + ',' +
    JSON.stringify(blackPieces) + ')';

    getPrologRequest(requestString);
}