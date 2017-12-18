
%Validates valid inputs
validColumn('A',X) :- X = 0.

validColumn('B',X) :- X = 1.

validColumn('C',X) :- X = 2.

validColumn('D',X) :- X = 3.

validColumn('E',X) :- X = 4.

%If the input is invalid keeps asking for a new input until its valid
validColumn(_Col,NewCol) :-
    write('Invalid input, try again!'),nl,
    write('Col: '),
    read(X),
    validColumn(X,NewCol).

%Validates valid row inputs, between 0 to 4, if its invalid keeps asking for input until valid
validRow(X,Y) :- X < 5, X > -1, Y is X.
validRow(_X,NewRow) :- 
        write('Invalid input,try again!'),nl,
        write('Row: '),
        read(Y),
        validRow(Y,NewRow).




%Asks the user to type the row, and checks its validality
askRow(NumericalRow) :- 
    write('Choose row '),read(Row),validRow(Row,NumericalRow),nl.

%Asks the user to type the column, and checks its validality
askCol(NumericalCol) :-
    write('Choose column ') ,read(Col) ,validColumn(Col,NumericalCol),nl.


%Ask the player to choose wich piece to use and sees if it belongs to the player pieces
askPieceType(Player,UsedPiece,PlayerPieces) :-
            write('Choose piece type (* or '), write(Player) , write(') '), read(Piece),
            translatePiece(Piece,UsedPiece),member(UsedPiece,PlayerPieces),nl.

