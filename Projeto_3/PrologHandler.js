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

function makeRequest(requestString) {
    getPrologRequest(requestString, this.handleReply);
}

function handleReply(data) {
    console.log('DATA', data);
}


function initializeVariables(callback) {
    let requestString = "startVars";
    getPrologRequest(requestString, callback);
}

function getValidMoves(board, piece, callback) {
    let requestString = 'getValidMovesMatrix(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(piece) + ')';

    getPrologRequest(requestString, callback);
}

function getScore(Player, callback) {
    if (Player == PLAYERS.WHITE) {
        var requestString = 'scoreW';
    } else if (Player == PLAYERS.BLACK) {
        var requestString = 'scoreB';
    }

    getPrologRequest(requestString, callback);
}

function getPieces(Player,callback){
    if (Player == PLAYERS.WHITE) {
        var requestString = 'piecesW';
    } else if (Player == PLAYERS.BLACK) {
        var requestString = 'piecesB';
    }

    getPrologRequest(requestString,callback);
}

function checkGameEnd(board,playerLetter,callback){
    let requestString = 'checkGameEnd(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(playerLetter) + ')';
    getPrologRequest(requestString,callback);
}

function processMovement(board,row,col,player,piece,callback){
    let requestString = 'processMovement(' +
        JSON.stringify(board) + ',' +
        JSON.stringify(row) + ',' +
        JSON.stringify(col) + ',' +
        JSON.stringify(player) + ',' +
        JSON.stringify(piece) + ')';
    
    getPrologRequest(requestString,callback);
}

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