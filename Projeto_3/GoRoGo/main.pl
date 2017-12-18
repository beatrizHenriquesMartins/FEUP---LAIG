:-consult('menu.pl').
:-consult('bot.pl').
:-use_module(library(system)).
:-use_module(library(random)).

%Function to start Game
goRoGo :- initialPrint, now(Y),setrand(Y),initiateGlobalValues, mainMenu(X), startGame(X).


%Initiates the board, and given a choice of the menu begins game logic
startGame(X) :- startBoard(CurrentBoard),once(showBoard(CurrentBoard)),
                %if statements
                (
                    (X =:= 3 -> requestWhiteFirstMove(CurrentBoard,NewBoard),
                                    once(showBoard(NewBoard)), ! ,
                                    it(not(continueGame(NewBoard,_BoardUpdated,'PP')),
                                        (!,fail)
                                    )
                    );
                    (X =:= 2 -> (botMenu(Y),handleBotDifficulty(Y, CurrentBoard, 'PB')));
                    (X =:= 1 -> (botMenu(Y),handleBotDifficulty(Y, CurrentBoard, 'BB')))
                ).

%Given the choice of the bot difficulty in the bot menu starts the game
handleBotDifficulty(Y, CurrentBoard,GameType) :- (
                                                    (Y == 3 -> (cls,goRoGo));
                                                    (Y == 2 -> setFirstPieceBot(CurrentBoard, NewBoard), once(showBoard(NewBoard)), !,
                                                                it(not(continueGame(NewBoard,_BoardUpdated,GameType, 1)),
                                                                   (!,fail)));

                                                    (Y == 1 -> (setFirstPieceBot(CurrentBoard, NewBoard), once(showBoard(NewBoard)),!,
                                                                  it(not(continueGame(NewBoard,_BoardUpdated,GameType, 0)),
                                                                        (!,fail)
                                                                  )
                                                                )
                                                    )
                                                ).

%Each iteration of a game for the diferent game types and bot difficulties, each iteration represents both players moves and always check if there is a winner
continueGame(NewBoard,BoardUpdated, 'PP'):-     !,                                 
									 ite((getMovement(NewBoard, 'O', NewBoard1,ResB), ResB == 1),
                                            once(showBoard(NewBoard1)),
                                            (verifyWinner('X'), !, fail)
                                        ),
									 nl,
									 ite((getMovement(NewBoard1, 'X', BoardUpdated,ResW), ResW =:= 1),
                                             once(showBoard(BoardUpdated)),
                                             (verifyWinner('O'),!,fail)
                                        ),
                                     nl,
                                     ite((checkGameEnd(EndRes), EndRes \= 0), 
                                            continueGame(BoardUpdated,_NextBoard, 'PP'),
                                            (verifyWinner,!,fail)
                                        ).

continueGame(NewBoard,BoardUpdated,'PB', 0):-  !,                                    
									 ite((getMovement(NewBoard, 'O', NewBoard1,ResB),ResB =:= 1),
                                            once(showBoard(NewBoard1)),
                                            (verifyWinner('X'),!, fail)
                                        ),
									 nl,
									 ite((checkGameEnd(NewBoard1, 'X', ResCheck), ResCheck == 1, randomBotMovement(NewBoard1, 'X', BoardUpdated,ResW), ResW == 1),
                                             once(showBoard(BoardUpdated)),
                                             (verifyWinner('O'),!,fail)
                                        ),
                                     nl,
                                     ite((checkGameEnd(EndRes), EndRes \= 0),
                                             continueGame(BoardUpdated,NextBoard, 'PB', 0),
                                             (verifyWinner, !,fail)
                                        ).

continueGame(NewBoard,BoardUpdated, 'BB', 0):-  !,                                  
									 ite((checkGameEnd(NewBoard, 'O', ResCheck1), ResCheck1 == 1,randomBotMovement(NewBoard, 'O', NewBoard1,ResB),ResB == 1),
                                            (sleep(1), once(showBoard(NewBoard1))),
                                            (verifyWinner('X'),!,fail)
                                        ),
                                     nl,
									 ite((checkGameEnd(NewBoard1, 'X', ResCheck2), ResCheck2 == 1,randomBotMovement(NewBoard1, 'X', BoardUpdated,ResW), ResW == 1), 
                                            (sleep(1), once(showBoard(BoardUpdated))),
                                            (verifyWinner('O'),!,fail)
                                        ),
                                     nl,
                                     ite((checkGameEnd(EndRes), EndRes \= 0),
                                            (continueGame(BoardUpdated,NextBoard, 'BB', 0)),
                                            (verifyWinner, !, fail)
                                        ).


continueGame(NewBoard,BoardUpdated,'PB', 1):-  !,                                    
									 ite((getMovement(NewBoard, 'O', NewBoard1,ResB),ResB =:= 1),
                                            once(showBoard(NewBoard1)),
                                            (verifyWinner('X'),!, fail)
                                        ),
									 nl,
									 ite((checkGameEnd(NewBoard1, 'X', ResCheck2), ResCheck2 == 1,inteligentBotPlay(NewBoard1, 'X', BoardUpdated,ResW), ResW == 1),
                                             once(showBoard(BoardUpdated)),
                                             (verifyWinner('O'),!,fail)
                                        ),
                                     nl,
                                     ite((checkGameEnd(EndRes), EndRes \= 0),
                                        continueGame(BoardUpdated,NextBoard, 'PB', 1),
                                        (verifyWinner, !,fail)
                                     ).

continueGame(NewBoard,BoardUpdated, 'BB', 1):-    !,                                  
									 ite((checkGameEnd(NewBoard, 'O', ResCheck1), ResCheck1 == 1,inteligentBotPlay(NewBoard, 'O', NewBoard1,ResB),ResB == 1),
                                            (sleep(1), once(showBoard(NewBoard1))),
                                            (verifyWinner('X'),!,fail)
                                        ),
									 nl,
									 ite((checkGameEnd(NewBoard1, 'X', ResCheck2), ResCheck2 == 1,inteligentBotPlay(NewBoard1, 'X', BoardUpdated,ResW), ResW == 1),
                                         (sleep(1), once(showBoard(BoardUpdated))),
                                        (verifyWinner('O'),!,fail)
                                     ),
                                     nl,
                                     ite((checkGameEnd(EndRes), EndRes \= 0),
                                            (continueGame(BoardUpdated,NextBoard, 'BB', 1)),
                                            (verifyWinner, !, fail)
                                        ).

%Not of function
not(X) :- X,!,fail.
not(_).

%0 stop game
%1 otherwise
%Calls the function that ask the user what he wants to play until it gives a valid move (assuming theres is valid move) if there is no valid move it knows it is to end game

getMovement(NewBoard, Player, UpdatedBoard, Res):-
     ite((checkGameEnd(NewBoard, Player,EndRes), (EndRes \=0)), 
            (requestMovement(NewBoard,Player,UpdatedBoard, ResMove), (Res is 1)),
            (Res is 0)
        ),

	 ite((Res \= 0), 
            ite((ResMove =:= 1), 
                    (getMovement(NewBoard, Player, UpdatedBoard,_Res1)), 
                    (Res = 1)
                ),
            Res = 0
        ).


%0 - if is end of the game
%1 - otherwise
%Checks turn counter and see if it is in the last turn (24)
checkGameEnd(EndRes):-
    turnCounter(I), retract(turnCounter(I)), I1 is (I+2), 
    ite((I1=:=24), 
            (EndRes is 0),
            (assert(turnCounter(I1)), EndRes is 1)
        ).

%0 - if is end of the game
%1 - otherwise
%Checks if a player is going to loose because it doesnt have available moves to play or it used all normal pieces before henge pieces
checkGameEnd(Board, Player, EndRes) :- translatePlayer(Player, PlayerNumber), pieces(PlayerNumber, PiecesAvailable),
                                       ite(member(PlayerNumber, PiecesAvailable), 
                                            (EndRes is 1),
                                            (EndRes is 0)
                                          ),  
                                       ite(EndRes \= 0,
                                                ite(member(3, _AvailablePieces),
                                                        EndRes is 1 ,
                                                        (getValidMovesMatrix(Board, PlayerNumber, AvailableMoves), ite(AvailableMoves =:= [], EndRes= 0, EndRes = 1))
                                                    ),
                                           EndRes = 0).

%If the game ends by turn check both players scores and defines the winner
verifyWinner :- score(2,BlackScore), score(1,WhiteScore),
                ite((BlackScore > WhiteScore),verifyWinner('O'),verifyWinner('X')).

%Display the winner
verifyWinner(X) :- 
                write('Congratulations Player '), write(X) , write(' you won the game with '), translatePlayer(X,Y),score(Y,Score),write(Score), write(' points!!').

%Initiates the global values, turn counter, both player pieces and score
initiateGlobalValues :- 
                        abolish(score/2),
                        abolish(pieces/2),
                        abolish(turnCounter/1),
                        assert(score(2,0)),assert(score(1,0)),
                        assert(turnCounter(0)),
                        availablePiecesWInit(WhitePieces), assert(pieces(1,WhitePieces)),
                        availablePiecesBInit(BlackPieces), assert(pieces(2,BlackPieces)).
