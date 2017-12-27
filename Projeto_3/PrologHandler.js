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
        JSON.stringify(piece) + ',FinalList)';

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