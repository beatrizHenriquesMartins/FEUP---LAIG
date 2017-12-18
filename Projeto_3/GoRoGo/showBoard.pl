
%Translate board display char to number and vice versa
%empty
translate(0,T) :- T = ' '.
%white
translate(1,T) :- T = 'X'.
%black
translate(2,T) :- T = 'O'.
%henge
translate(3,T) :- T = '*'.
translate('A',T) :- T = 0.
translate('B',T) :- T = 1.
translate('C',T) :- T = 2.
translate('D',T) :- T = 3.
translate('E',T) :- T = 4.
translate(_X,_Y) :- write('INVALID INPUT').

%Translate Pieces char to number
translatePiece('O',T) :- T = 2.
translatePiece('X',T) :- T = 1.
translatePiece('*',T) :- T = 3.


%Translates Player characters to nuumber
translatePlayer('O',T) :- T = 2.
translatePlayer('X',T) :- T = 1.

%Initiates an empty board
startBoard([ [0,0,0,0,0],
	   		[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0]]).

%Hipotetical mid game state
boardMed([	[0,1,0,1,0],
	   	[1,0,1,2,0],
		[0,3,0,2,0],
		[2,0,0,1,0],
		[0,0,1,2,0]]).

%aInit game example
boardInit([ [2,1,1,2,0],
	   		[2,1,1,2,0],
			[0,3,3,0,1],
			[2,0,0,0,0],
			[0,2,0,0,0]]).

%Final Game example
boardFinal([ [0,1,0,3,3],
	   		[1,0,1,2,1],
			[0,3,2,2,2],
			[0,1,2,3,2],
			[0,0,1,3,0]]).

%Example available pieces
availablePiecesWMed([3,3,0,0,0,0,0,0,1,1,1,1]).
availablePiecesBMed([3,3,0,0,0,0,0,0,2,2,2,2]).


availablePiecesWInit([3,3,1,1,1,1,1,1,1,1,1,1]).
availablePiecesBInit([3,3,2,2,2,2,2,2,2,2,2,2]).

availablePiecesWFinal([0,0,0,0,0,0,0,0,0,0,0,0]).
availablePiecesBFinal([0,0,0,0,0,0,0,0,0,0,0,0]).

eatenPiecesWMed(2).
eatenPiecesBMed(0).

eatenPiecesWInit(0).
eatenPiecesBInit(0).

eatenPiecesWFinal(4).
eatenPiecesBFinal(4).

showGameStatus :- 	nl,
					write('Game Board Status: '),
					nl,
					nl,
					showBoard,
					nl,
					nl,
					showPiecesW,
					nl,
					showEatenPiecesW,
					nl,
					nl,
					showPiecesB,
					nl,
					showEatenPiecesB,
					nl,
					nl,
					showWinner,
					nl.


%function that displays the board
showBoard(CurrentBoard) :-
			 write('    A   B   C   D   E '),
			 nl,
			 write('  _____________________ '),
			 nl,
			 showBoard(CurrentBoard, 0).

showBoard([], _N).
showBoard([X|Y], N) :-
					write('  |   |   |   |   |   | '),
					nl,
					write(N),
					write(' | '),
					showLine(X),
					N1 is N+1,
					nl,
					write('  |___|___|___|___|___| '),
					nl,
					showBoard(Y, N1).

%display a row
showLine([]).
showLine([Head|Tail]) :-
	translate(Head, T),
	write(T),
	write(' | '),
	showLine(Tail).
			 


showPiecesB :- write('Available Pieces for Player Black: '), availablePiecesBFinal(X), showLine(X).
showPiecesW :- write('Available Pieces for Player White: '),availablePiecesWFinal(X), showLine(X).

showEatenPiecesW :- write('Points of White Player: '), eatenPiecesWFinal(X), showEatenPieces(X).
showEatenPiecesB :- write('Points of Black Player: '), eatenPiecesBFinal(X), showEatenPieces(X).


showEatenPieces(X) :- write(X).




initialPrint :- write('GoRoGo Game'),nl,nl,nl.

%clear screen solution
cls :- write('\e[2J').


%Display the Player current status,availabel pieces and current score
showPlayerStatus(Player,NumericPlayer,PlayerPieces) :-        
write('It is '), write(Player) ,write(' player turn!'),nl,
                            write('Here is your available pieces  '), translatePlayer(Player,NumericPlayer),pieces(NumericPlayer,PlayerPieces),showLine(PlayerPieces),nl,
                            write('Here is your current score   '), score(NumericPlayer,Score), write(Score), nl .
