
:- use_module(library(lists)).
:- use_module(library(ordsets)).
:-consult('showBoard.pl').
:-consult('input.pl').




%Request the player what move it wants to make ,which piece and where to put, with all verifications
requestMovement(Board,Player,NewBoard, Res) :- 
                            showPlayerStatus(Player,NumericPlayer,PlayerPieces),
                            askPieceType(Player,UsedPiece,PlayerPieces),
                            askCol(Column),
                            askRow(Row),
                            ite(processMovement(Board,Row,Column,NumericPlayer,UsedPiece,NewBoard), 
                                (
                                Res is 0,
                                removePiece(PlayerPieces,UsedPiece,NumericPlayer)
                                ), 
                                Res is 1
                                ).

%Requests first Henge piece placement of the white player
requestWhiteFirstMove(Board,NewBoard) :- 
                                write('Before the game starts, white player chooses where to place the first Henge piece'),nl,
                                askCol(Column),
                                askRow(Row),
                                addPiece(Board,3,Row,Column,NewBoard), addHengePiecetoList(Row, Column).

%Adds a piece to the board
addPiece(Board,Piece,Row,Column,NewBoard) :- getPieceFromMatrix(Board,Row,Column,Ret), Ret =:= 0,replaceMatrix(Board,Row,Column,Piece,NewBoard) .

%Replaces an element of a list given an index and value
replace([_H|T],0,X,[X|T]).
replace([H|T],Index,Value,[H|R]) :-
    Index > 0,
    I1 is Index-1,
    replace(T,I1,Value,R).

%Replaces an element of a matrix given a row and col
replaceMatrix([H|T],0,Collumn,Value,[R|T]) :- replace(H,Collumn,Value,R).
replaceMatrix([H|T],Line,Collumn,Value,[H|R]):-
    Line > 0 , Collumn > -1,
    L1 is Line-1,
    replaceMatrix(T,L1,Collumn,Value,R).

%Removes a piece of the matrix, basically replaces the value of the matrix with a 0
removePieceMatrix(Board,Row,Col,NewBoard) :- replaceMatrix(Board,Row,Col,0,NewBoard).

%Removes a piece of the list of available pieces of player
removePiece(ListPieces,UsedPiece,Player) :-  removePiece(ListPieces,UsedPiece,Player,NewListPieces), retract(pieces(Player,ListPieces)), assert(pieces(Player,NewListPieces)).
removePiece([H|T],H,_,[0|T]).
removePiece([H|T],PieceToRemove,_,[H|R]) :- removePiece(T,PieceToRemove,_,R).


%Return the current element in the matrix given a position
getPieceFromMatrix(Board,I,J,Elem) :-
      nth0(I,Board,Row),
      nth0(J,Row,Elem).


% res = 2 - there's an empty space/henge piece around
% res = 1 - this piece is blocked
%Checks if a piece or a group of same color pieces are surrounded by enemie pieces if theyre surrounded returns all pieces blocked
isBlockedAround(_Board, -1, _Col, _Piece, Res, _ListRes, _ListResNext) :- Res is 3.
isBlockedAround(_Board, 5, _Col, _Piece, Res, _ListRes, _ListResNext) :- Res is 3.
isBlockedAround(_Board, _Row, -1, _Piece, Res, _ListRes, _ListResNext) :- Res is 3.
isBlockedAround(_Board, _Row, 5, _Piece, Res, _ListRes, _ListResNext) :- Res is 3.
isBlockedAround(Board, Row, Col, Piece, Res, ListRes, ListResNext):-
                              DownRow is Row + 1,
                              UpRow is Row - 1,
                              LeftCol is Col - 1,
                              RightCol is Col + 1,
                              replaceMatrix(Board,Row,Col,5,NewBoard),
                              (
                                (
                                  ite((UpRow > -1),
                                        verifyPieceAdj(NewBoard, UpRow, Col, Piece, ResUp, ListResNext, ListResUp), 
                                        isBlockedAround(NewBoard, UpRow, Col, Piece, ResUp, ListResNext, ListResUp)
                                     )
                                ),
                                (
                                  ite((DownRow < 5), 
                                        verifyPieceAdj(NewBoard, DownRow, Col, Piece, ResDown, ListResNext, ListResDown), 
                                        isBlockedAround(NewBoard, DownRow, Col, Piece, ResDown, ListResNext, ListResDown)
                                    )
                                ),
                                (
                                  ite((LeftCol > -1), 
                                        verifyPieceAdj(NewBoard, Row, LeftCol, Piece, ResLeft, ListResNext, ListResLeft), 
                                        isBlockedAround(NewBoard, Row, LeftCol, Piece, ResLeft, ListResNext, ListResLeft)
                                     )
                                ),
                                (
                                  ite((RightCol < 5), 
                                        verifyPieceAdj(NewBoard, Row, RightCol, Piece, ResRight, ListResNext, ListResRight), 
                                        isBlockedAround(NewBoard, Row, RightCol, Piece, ResRight, ListResNext, ListResRight)
                                     )
                                )
                              ),
                              ite((ResUp =:= 2; ResDown =:= 2; ResRight =:= 2; ResLeft =:= 2),
                                     (Res is 2), 
                                     (appendLists(ListResNext, [[Row, Col]], ListResUp, ListResDown, ListResLeft, ListResRight, ListRes), (Res is 1))
                                 ).


%Function if then elses
ite(If, Then) :- If,!,Then.
ite(If, Then, _Else) :- If,!,Then.
ite(_If, _Then, Else) :- Else.

ite(If, Then, _Elseif, _Thenif,_Else) :- If,!,Then.
ite(_If, _Then, Elseif, Thenif, _Else) :- Elseif, !, Thenif.
ite(_If, _Then, _Elseif, _Thenif, Else) :- Else.

it(If, Then):- If, !, Then.
it(_,_).


%Res=0 - analyse again
%Res=2 - is empty in that side
%Res=3 - is blocked in that side
%Evaluates a piece next to the piece started in isBlockedAround, to see if it is enemy, friendly or empty
verifyPieceAdj(Board, Row, Col, Piece, Res, _ListRes, _ListResNext):-
                        getPieceFromMatrix(Board,Row,Col, AdjPiece),
                        ite((AdjPiece =:= Piece) , 
                            isBlockedAround(Board, Row, Col, AdjPiece, Res, _ListResNext, _ListResNextNext) , 
                        (AdjPiece =:= 0), 
                            (Res is 2), 
                            (Res is 3)
                        ).


%append all lists(if any list is not actuallly a list this one is not appended) removing duplicates and put the result in ListRes
appendLists(ListNext, Point, List1, List2, List3, List4, ListRes):-
        append(ListNext, Point, ListNext1), 
        ite(is_list(List1), 
                append(ListNext1, List1, ListNext2), 
                (ListNext2 = ListNext1)
            ), 
        ite(is_list(List2), 
                append(ListNext2, List2, ListNext3), 
                (ListNext3 = ListNext2)
            ),
        ite(is_list(List3), 
                append(ListNext3, List3, ListNext4), 
                (ListNext4 = ListNext3)
            ), 
        ite(is_list(List4), 
                append(ListNext4, List4, ListFinal), 
                (ListFinal = ListNext4)
            ), 
        remove_dups(ListFinal, ListRes).


%Check an hipotetical move by the player and sees if the piece would be eaten, if it goes ok the move is valid else it isnt since it would make the peace placed to be imeadiately eaten
checkSuicideMove(Board,Row,Col,Piece) :-
    isBlockedAround(Board,Row,Col,Piece,Res,_ListRes,_ListResNext),
    addPiece(Board,Piece,Row,Col,NewBoard),
    checkCapture(NewBoard,Row,Col,Piece,ToRemoveList),length(ToRemoveList,Size),!,
    it(Res \= 2, 
        it(Size == 0, 
            (!,fail)
          )
       ).


%verify if there's any henge piece that is blocking any oppositor piece(s) and remove these piece(s)
verifyHengePieces(Board, _Player, [], NewBoard, FinalBoard) :- ite(is_list(NewBoard), FinalBoard=NewBoard, FinalBoard=Board).
verifyHengePieces(Board, _Player, [H|T], NewBoard, FinalBoard) :-
    nth0(0,H, Row), nth0(1, H, Col),
    tryCapture(Board, Row, Col, _Player, NewBoard),
    verifyHengePieces(NewBoard, _Player, T, _NewBoardRes, FinalBoard).


%Add the played henge piece to the global list of henge pieces
addHengePiecetoList(Row,Col):-
        ite(hengeList(OldHengeList), 
                (
                    append(OldHengeList, [[Row,Col]], NewHengeList), abolish(hengeList/1)
                ),
                 NewHengeList=[[Row,Col]]
            ),
        assert(hengeList(NewHengeList)).

%Process the movement given by the player, checks if it as vald movement
processMovement(Board,Row,Col,Player,UsedPiece,CapturedBoard) :-
          hengeList(ListHenges),
          verifyHengePieces(Board, Player, ListHenges, _BoardTest, BoardHenges),
          getPieceFromMatrix(Board,Row,Col,Piece),

          ite(Piece \= 0,
                (write('Occupied place!'),!,fail),
                Piece =Piece
            ),
          ite(UsedPiece \= 3,
                (
                    ite(checkSuicideMove(BoardHenges,Row,Col,UsedPiece),
                            (
                                addPiece(BoardHenges,UsedPiece,Row,Col,NewBoard),tryCapture(NewBoard,Row,Col,Player,CapturedBoard)
                            ),
                            (
                                write('Invalid Suicide move'),nl,nl,!,fail
                            )
                        )
                ),
                (
                    addPiece(BoardHenges,UsedPiece,Row,Col,NewBoard),
                    tryCapture(NewBoard,Row,Col,Player,CapturedBoard), 
                    addHengePiecetoList(Row,Col)
                )
            ).

%Given a piece position checks all the pieces that piece can capture, if there are no pieces to be captured FinalRemoveList is empty
checkCapture(Board,Row,Col,Player,FinalRemoveList) :- 
                                           DownRow is Row + 1,
                                           UpRow is Row - 1,
                                           LeftCol is Col - 1,
                                           RightCol is Col + 1,
                                           (
                                                ite((UpRow > -1),
                                                        (
                                                            getPieceFromMatrix(Board,UpRow,Col,Value1),
                                                            ite((Value1 \= Player, Value1 \= 3,Value1 \= 0),
                                                                    (
                                                                        isBlockedAround(Board,UpRow,Col,Value1,Res1,ListRes1,_List),
                                                                        ite(Res1 =:= 1,
                                                                                append([],ListRes1,RemoveList1),
                                                                                RemoveList1 = []
                                                                            )
                                                                    ), RemoveList1 = []
                                                                )
                                                        ), 
                                                        RemoveList1 = []

                                                    )
                                            ),

                                      (
                                                ite((DownRow < 5),
                                                        (
                                                            getPieceFromMatrix(Board,DownRow,Col,Value2),
                                                            ite((Value2 \= Player, Value2 \= 3,Value2 \= 0),
                                                                    (
                                                                        isBlockedAround(Board,DownRow,Col,Value2,Res2,ListRes2,_List),
                                                                        ite(Res2 =:= 1,
                                                                                append(RemoveList1,ListRes2,RemoveList2),
                                                                                RemoveList2 = RemoveList1
                                                                            )
                                                                    ), 
                                                                    RemoveList2 = RemoveList1
                                                                )
                                                        ), 
                                                        RemoveList2 = RemoveList1
                                                    )
                                        ),
                                        (
                                                ite((LeftCol > -1),
                                                        (
                                                            getPieceFromMatrix(Board,Row,LeftCol,Value3),
                                                            ite((Value3 \= Player, Value3 \= 3,Value3 \= 0),
                                                                (
                                                                    isBlockedAround(Board,Row,LeftCol,Value3,Res3,ListRes3,_List),
                                                                    ite(Res3 =:= 1,
                                                                            append(RemoveList2,ListRes3,RemoveList3),
                                                                            RemoveList3=RemoveList2
                                                                        )
                                                                ),
                                                                    RemoveList3 = RemoveList2
                                                               )
                                                        ), 
                                                        RemoveList3 = RemoveList2

                                                    )
                                        ),
                                        (
                                                ite((RightCol < 5),
                                                        (
                                                            getPieceFromMatrix(Board,Row,RightCol,Value4),
                                                            ite((Value4 \= Player, Value4 \= 3,Value4 \= 0),
                                                                    (
                                                                        isBlockedAround(Board,Row,RightCol,Value4,Res4,ListRes4,_List),
                                                                        ite(Res4 =:= 1,
                                                                                append(RemoveList3,ListRes4,FinalRemoveList), 
                                                                                FinalRemoveList = RemoveList3
                                                                            )
                                                                    ),
                                                                    FinalRemoveList = RemoveList3
                                                                )
                                                        ), 
                                                        FinalRemoveList = RemoveList3
                                                    )
                                        ).

%Get the list of the to be captured pieces and removes them from the board, updating Player score                                     
tryCapture(Board,Row,Col,Player,NewBoard) :-
                                          checkCapture(Board,Row,Col,Player,FinalRemoveList),
                                          remove_dups(FinalRemoveList,FinalList),
                                          removeFromMatrix(Board,_BoardList,FinalList,NewBoard),
                                          ite(is_list(NewBoard), NewBoard=NewBoard, NewBoard=Board),
                                          length(FinalList,Length),
                                          updateScore(Player,Length).



%Updates player score
updateScore(Player,IncScore) :- score(Player,CurrentScore), NewScore is (CurrentScore + IncScore), retract(score(Player,CurrentScore)), assert(score(Player,NewScore)).  

%Given a list of coordinates  substitutes all elements with a 0 (basically removes all pieces from matrix)
removeFromMatrix(_Board,MatrixBoardList, [], FinalBoard) :- nth0(0, MatrixBoardList, FinalBoard).
removeFromMatrix(Board, MatrixBoardList,[H|T], FinalBoard) :-
    ite(\+is_list(MatrixBoardList), MatrixBoardList=[Board], MatrixBoardList = MatrixBoardList),
    nth0(0, MatrixBoardList, MatrixBoard),
    nth0(0,H,Row),nth0(1,H,Col),
    removePieceMatrix(MatrixBoard, Row,Col, NewBoard),
    append([NewBoard],MatrixBoardList, NewBoardList),
    removeFromMatrix(Board, NewBoardList,T, FinalBoard).

%Given a matrix and a player stores a list of coordinates where that player can put the piece
getValidMovesMatrix(Board, PieceType, FinalList) :- getValidMovesMatrix(Board, 0, PieceType, _List, FinalList).
getValidMovesMatrix(_,5,_,List, FinalList) :- FinalList = List.        
getValidMovesMatrix(Board,Row,PieceType,List, FinalList) :- 
                
                Row1 is Row + 1,
                ite(is_list(List),List = List,List = []),
                getValidMovesFromlist(Board,Row,0,PieceType,_AuxList,ReturnList),
                append(List,ReturnList,NextList),
                getValidMovesMatrix(Board,Row1,PieceType,NextList, FinalList).


%Given a row cehecks and stores all positions where a piece can be placed
getValidMovesFromlist(_Board,_NumberRow,5,_PieceType,ListValues, FinalListValues) :- FinalListValues = ListValues.
getValidMovesFromlist(Board,NumberRow,NumberColumns,PieceType,ListValues,FinalListValues) :-
                NumberColumns < 5, 
                ite(\+is_list(ListValues), ListValues = [], ListValues = ListValues),  
                Col1 is NumberColumns + 1,
                nth0(NumberRow,Board,RowList),
                nth0(NumberColumns,RowList,Piece),
                ite((PieceType =:= 3,Piece =:= 0),
                        (
                            append([[NumberRow,NumberColumns]],ListValues,NextListValues),
                            getValidMovesFromlist(Board,NumberRow,Col1,PieceType,NextListValues,FinalListValues)
                        ),
                        ite((PieceType \= 3, Piece =:= 0,checkSuicideMove(Board,NumberRow,NumberColumns,PieceType)),
                                (
                                    append([[NumberRow,NumberColumns]],ListValues,NextListValues),
                                    getValidMovesFromlist(Board,NumberRow,Col1,PieceType,NextListValues,FinalListValues)
                                ),
                                (
                                    getValidMovesFromlist(Board,NumberRow,Col1,PieceType,ListValues,FinalListValues)
                                )
                            )
                    ).


           
            
            
