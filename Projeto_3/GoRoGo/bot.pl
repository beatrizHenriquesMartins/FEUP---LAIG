:-consult('movement.pl').


%Function that makes random available moves
randomBotMovement(Board,PlayerType,NewBoard, Res) :-
            %translatePlayer(PlayerType,NumericPlayer),
            pieces(PlayerType,PlayerPieces),
            choosePiece(_PieceA, PlayerPieces, Piece),
            score(PlayerType,Score),
            %write('The Current Player '), write(PlayerType), write(' score is: '), write(Score),nl,nl,
            getValidMovesMatrix(Board,0,Piece,_List,AvailableMoves),
            length(AvailableMoves,Length),
            ite(Length == 0,
                    (Res is 0),
                    (   random_member(BoardPos,AvailableMoves),
                        nth0(0,BoardPos,Row),
                        nth0(1,BoardPos,Col),
                        processMovement(Board,Row,Col,PlayerType,Piece,NewBoard),
                        removePiece(PlayerPieces,Piece,PlayerType), (Res is 1)
                    )
            ).

%randomly chooses an element of the available pieces until it is a piece and not empty spot
choosePiece(Piece, PlayerPieces, FinalPiece) :-
    random_member(Piece, PlayerPieces), ite(Piece =:= 0, choosePiece(_Piece1, PlayerPieces, FinalPiece), FinalPiece is Piece).

%First Henge piece is put randomly on the board by bot
setFirstPieceBot(CurrentBoard, NewBoard) :-
            random(0,5, Row),
            random(0,5, Col),
            addPiece(CurrentBoard,3,Row,Col,NewBoard), addHengePiecetoList(Row, Col).


%Returns the Max element of a list and its index , if there is more than one max it set the index of the first one of the list
max_list([X|Xs],Max,Index):-
    max_list(Xs,X,0,0,Max,Index).

max_list([],OldMax,OldIndex,_, OldMax, OldIndex).
max_list([X|Xs],OldMax,_,CurrentIndex, Max, Index):-
    X > OldMax,
    NewCurrentIndex is CurrentIndex + 1,
    NewIndex is NewCurrentIndex,
    max_list(Xs, X, NewIndex, NewCurrentIndex, Max, Index).
max_list([X|Xs],OldMax,OldIndex,CurrentIndex, Max, Index):-
    X =< OldMax,
    NewCurrentIndex is CurrentIndex + 1,
    max_list(Xs, OldMax, OldIndex, NewCurrentIndex, Max, Index).

%Gets a list o points got for each move of available piece and stores the best
botGetBestMovement(Board,Piece,OptimalMove) :-
            getValidMovesMatrix(Board,Piece,AvailableMoves),
            it(AvailableMoves == [], (!,fail)),
            getNumberofCapturedPieces(Board,Piece,AvailableMoves,CapturedPiecesList),
            max_list(CapturedPiecesList,Max,Index),
           ite((Max == 0),(random_member(OptimalMove,AvailableMoves)),
            nth0(Index,AvailableMoves,OptimalMove)).

%From a list o available moves stores the score that move would give
getNumberofCapturedPieces(_Board,_Piece,[],_).
getNumberofCapturedPieces(Board,Piece,[H|T],[R|E]):-
        nth0(0,H,Row),
        nth0(1,H,Col),
        NewBoard = Board,
        replaceMatrix(NewBoard,Row,Col,Piece,NewBoard1),
        checkCapture(NewBoard1,Row,Col,Piece,List),
        length(List,HowMany),
        R is HowMany,
        getNumberofCapturedPieces(Board,Piece,T,E).

%Bot randomly chooses a piece, and puts it on the most optimal position (the position where he captures the most enemies), if there is no optimal position it randomly makes a move
inteligentBotPlay(Board,PlayerType,NewBoard,Res) :-
            %translatePlayer(PlayerType,NumericPlayer),
            pieces(PlayerType,PlayerPieces),
            choosePiece(_PieceA, PlayerPieces, Piece),
            score(PlayerType,Score),
            %write('The Current Player '), write(PlayerType), write(' score is: '), write(Score),nl,nl,
            ite(botGetBestMovement(Board,Piece,FinalOptimalMove),(
                nth0(0,FinalOptimalMove,Row),
                nth0(1,FinalOptimalMove,Col),
                processMovement(Board,Row,Col,PlayerType,Piece,NewBoard),
                removePiece(PlayerPieces,Piece,PlayerType),(Res is 1)
            ), (Res is 0)).
