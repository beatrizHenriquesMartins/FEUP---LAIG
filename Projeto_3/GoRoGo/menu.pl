
%Main Menu to choose main game mode
mainMenu(X) :- 
				put_code(9615),
				write('---------------- MAIN MENU ------------------------ '), put_code(9615),
				nl,
				put_code(9615),write('                                                    '),put_code(9615),
				nl,
				put_code(9615),
				write('          Which type of game you prefer:            '), put_code(9615),
				nl,
				put_code(9615),write('                                                    '),put_code(9615),
				nl,
				put_code(9615),
				write('          1: Pc-Pc                                  '), put_code(9615),
				nl,
				put_code(9615),
				write('          2: Pc-User                                '), put_code(9615),
				nl,
				put_code(9615),
				write('          3: User-User                              '), put_code(9615),
				nl,
				put_code(9615),write('                                                    '),put_code(9615),
				nl,
				put_code(9615),
				write('          Chooose your option:'),read(X).
				

%Menu to choose difficulty of bot
botMenu(X) :- 
			 nl,nl,
			 write('|----------------  BOT MENU  ------------------------|'),
			 nl,write('|                                                    |'),
			 nl,
			 write('             Please choose the bot difficulty: '),
			 nl,
			 write('             1: Easy(Random)'),
			 nl,
			 write('             2: Intermediate'),
			 nl,
			 write('             3: Go Back'),
			 nl,
			 write('             Choose your option: '),
			 read(X).