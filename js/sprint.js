
'use strict'





// initGame() - done
// //This is called when page loads

// buildBoard() 
// Builds the board Set mines at random
//  locations Call setMinesNegsCount() Return the created board


// renderBoard(board) Render the board as a <table> to the page

// setMinesNegsCount(board)
// Count mines around each cell and set the cell's minesAroundCount.



// cellClicked(elCell, i, j) Called when a cell (td) is clicked

// cellMarked(elCell) Called on right click to mark a cell 
// (suspected to be a mine) Search the web (and implement) 
// how to hide the context menu on right click

// checkGameOver() Game ends when all mines are marked,
//  and all the other cells are shown


//  expandShown(board, elCell, i, j) When user clicks a cell 
//  with no mines around, we need to open not only that cell,
//   but also its neighbors. 
//   NOTE: start with a basic implementation 
//   that only opens the non-mine 1st degree neighbors BONUS: 
//  if you have the time later,
//   try to work more like the real algorithm 
//   (see description at the Bonuses section below)



//– A Matrix containing cell objects: Each cell:
// /The model
var gBoard 


//This is an object by which the board size is set
// (in this case: 4x4 board and how many mines to put)
var gLevel = {
    SIZE: 4,
    MINES: 2
};



// This is an object in which you can 
// keep and update the current game state:
// isOn: Boolean, when true we let the user play
// shownCount: How many cells are shown 
// markedCount: How many cells are marked (with a flag)
// secsPassed: How many seconds passed

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}



//const BOMB = '&#xf1e2'
const BOMB = 1
const flag = '🏳 '
const gSize = 4


function initGame() {

    gBoard = createBoard()
    renderBoard(gBoard)
    
    // gGame.isOn = true

}


function createBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: true,
                image: ''
            }
            board[i][j] = cell
        }
    }
    board[1][1].isMine = true
    board[1][2].isMine = true
    // board[1][1] = BOMB
    // board[1][2] = BOMB

    return board
}


 
function renderBoard(board) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < gSize; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < gSize; j++) {

            const cell = gBoard[i][j]
            const className = (cell.isMine) ? cell.image='💣' : cell.image= '🧂'

            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="${className}">${cell.image}  
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    var elTable = document.querySelector('table')
    elTable.innerHTML = strHTML
}


function cellClicked(elCell, i, j){ //Called when a cell (td) is clicked
    console.log('hello');

} 