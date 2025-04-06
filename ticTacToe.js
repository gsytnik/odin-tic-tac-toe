const dialog = document.querySelector('.startGameDialog');
const gameBoardElement = document.querySelector('.gameBoard');

const gameHandler = (function () {
    const playerList = [];
    let gameStarted = false;
    const winnerHeader = document.getElementById('winnerHeader');

    function startGame(players) {
        for (let player of players) {
            playerList.push(player);
        }
        gameStarted = true;
        winnerHeader.textContent = `${playerList[gameBoard.getTurn()].getName()}'s Turn.`
    }

    function winGame(winner) {
        gameStarted = false;
        winnerHeader.textContent = `${playerList[winner].getName()} WINS`;
    }

    function addMove(x, y){
        if (!gameStarted) return;

        symbol = playerList[gameBoard.getTurn()].getSymbol();
        gameBoard.addMove(x, y, symbol);

        if (!gameStarted) return;

        winnerHeader.textContent = `${playerList[gameBoard.getTurn()].getName()}'s Turn.`;
    }

    function reset() {
        gameBoard.clearBoard();
        gameBoard.resetTurn();

        if (playerList.length) {
            gameStarted = true;
            winnerHeader.textContent = `${playerList[gameBoard.getTurn()].getName()}'s Turn.`   
        }

    }

    function wipePlayers() {
        while (playerList.length) {
            playerList.pop();
        }

    }

    function getPlayer(idx) {
        return playerList[idx];
    }

    return {reset, startGame, getPlayer, addMove, winGame, wipePlayers}
})();


const gameBoard = (function () {

    const gameBoardElement = document.querySelector('.gameBoard');
    const players = 2;

    const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let turn = 0;
    const winEvent = new CustomEvent('gameWon', {detail: getTurn}); 

    function addMove(x, y, symbol) {
        if (board[x][y] !== '') return; 
        board[x][y] = symbol;
        render();
        checkWinner();
        turn++;
        turn = turn % players;
    }

    function checkWinner(){
        //row
        for (row of board) {
            if (row[0] !== '' && row[0] === row[1] && row[0] === row[2]) {
                gameBoardElement.dispatchEvent(winEvent);
                return true;
            }
        }

        // col
        for (let i = 0; i < 3; i++) {
            if (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
                gameBoardElement.dispatchEvent(winEvent);
                return true;
            }
        }

        // diag
        if ((board[1][1] !== '' && board[1][1] === board[0][0] && board[1][1] === board[2][2])
            || (board[1][1] !== '' &&  board[1][1] === board[0][2] && board[1][1] === board[2][0])) {
                gameBoardElement.dispatchEvent(winEvent);
            return true;
        }

        return false;
    }

    function clearBoard() {
        for (row of board) {
            for (index in row) {
                row[index] = '';
            }
        }

        render();
    }

    function render() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                element = getElementOfCoord(i, j);
                element.textContent = board[i][j];
            }
        }
    }

    function getElementOfCoord(x, y) {
        element = document.querySelector(`.gameRow.number${x+1} .gameSquare.number${y+1}`);
        return element;
    }

    function resetTurn () {
        turn = 0;
    }

    function getTurn () {
        return turn;
    }

    return {addMove, resetTurn, clearBoard, getTurn};

})();


function Player(name, symbol) {

    function getSymbol() {
        return symbol;
    }

    function getName() {
        return name;
    }

    return { getSymbol, getName}

}


function setupListeners() {

    const playerOneName = document.getElementById('playerOneName');
    const playerTwoName = document.getElementById('playerTwoName');

    dialog.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.submitter.classList.contains('cancelButton')) {
            dialog.close();
        }
    
        if (e.submitter.classList.contains('submitButton')) {
            handleNewGameSubmission(playerOneName, playerTwoName);
            dialog.close();
        }
    });

    gameBoardElement.addEventListener('click', (e) => {

        if (e.target.classList.contains('gameSquare')) {
            let xCoord, yCoord; 
            [xCoord, yCoord] = getCoordsFromSquare(e.target);
            gameHandler.addMove(xCoord, yCoord);
        }

        if (e.target.id === 'startGameButton') {
            dialog.showModal();
        }

        if (e.target.id === 'resetGameButton') {
            gameHandler.reset();
        }
    
    });

    gameBoardElement.addEventListener('gameWon', (e) => {
        let winner = e.detail();
        gameHandler.winGame(winner);
    });

}


function handleNewGameSubmission(playerOneName, playerTwoName) {
    let player1 = new Player(playerOneName.value, 'X');
    let player2 = new Player(playerTwoName.value, 'O');

    gameHandler.wipePlayers();
    gameHandler.reset();
    gameHandler.startGame([player1, player2]);
}


function getCoordsFromSquare(target) {
    let classToNumber = {
        'number1': 0,
        'number2': 1,
        'number3': 2
    }
    let classes = target.classList.value.split(' ').filter(item => item !== 'gameSquare' && item !== 'gameRow');
    let parentClasses = target.parentNode.classList.value.split(' ').filter(item => item !== 'gameSquare' && item !== 'gameRow');
    
    let xCoord = classToNumber[parentClasses[0]];
    let yCoord = classToNumber[classes[0]];


    return [xCoord, yCoord];
}


function main(){
    setupListeners();
}

main();