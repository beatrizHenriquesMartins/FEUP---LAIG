class PrologHandler {
    constructor(port) {
        this.requestPort = port || 8080;
    }

    getPrologRequest(requestString, onSucess, onError) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.requestPort + '/' + requestString, true);

        request.onload = onSucess || function (data) {
            console.log("Reques Sucessful. Reply: " + data.target.response);
        };
        request.onerror = onError || function () {
            console.log("Error waiting for response");
        };
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString){
        this.getPrologRequest(requestString,this.handleReply);
    }

    handleReply(data){
        console.log(data);
    }
}