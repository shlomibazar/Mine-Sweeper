
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
const BOMB = '💣'
const FLAG = '🏳 '
const gSize = 4
const FIRE = '🔥'
var EMPTY = '🔳'
var COVERD = '🔲'

var winlSmiley = '😎'
var normalSmiley = '😃'
var loselSmiley = '😱'

var gtimerInterval = 0
var gLives = 1






// function changeButton() {
//     var elButton = document.querySelectorAll('button')
//     //console.log('elButton',elButton)
//     for (var i = 0; i < 1; i++) {
//         var currButton = elButton[i]
//         console.log('i:', 'currButton', i, currButton)

//         var currText = currButton.innerText
//         console.log('currText:', currText)

//         if (elButton.innerText === '😃 restart') console.log('hey')
//         if (elButton.innerText === '👶 easy mode') console.log('easy')
//         if (elButton.innerText === '🧒 medium mode') console.log('med')
//         if (elButton.innerText === '🏋 hard mode') console.log('hard')
//     }


//     //console.log('elButton',elButton)
//     //elButton.innerHTML = normalSmiley

// }
var startStopWatch = 1 

function initGame() {
    var elButton = document.querySelector('button')
    elButton.innerText = '😃'
    gLives = 3
    livesCount()
    gBoard = createBoard()
    renderBoard(gBoard)

    setMinesNegsCount(gBoard)
    gGame.isOn = true

    var stopWatch = document.querySelector('.stopWatch span')

}

function chooseMode(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    // console.log('gLevel.size',gLevel.size)
    // console.log('gLevel.Mines',gLevel.Mines)
    initGame()
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

    for (var i = 0; i < gLevel.MINES; i++) {

        var randIdxI = getRandomIntInclusive(1, gLevel.SIZE - 1)
        var randIdxJ = getRandomIntInclusive(1, gLevel.SIZE - 1)

        board[randIdxI][randIdxJ].isMine = true
        //console.log('i:', randIdxI, 'j:', randIdxJ, board[randIdxI][randIdxJ])
    }


    // board[1][1].isMine = true
    // board[1][2].isMine = true



    return board
}



function renderBoard(board) {
    //console.log('renderBoard SIZE',gLevel.SIZE)

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < gLevel.SIZE; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {

            const cell = gBoard[i][j]
            //const className = (cell.isMine) ? cell.image = '💣' : cell.image = '🧂'
            cell.image = COVERD
            // i updated class name to cell insted of className and cell.image = covered
            // if i update the cell to 'cell' i get the style but not the content of the cell
            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="${cell}">${cell.image}
  
            

            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    var elTable = document.querySelector('table')
    elTable.innerHTML = strHTML
}


function cellClicked(elCell, i, j) { //Called when a cell (td) is clicked
    // console.log('hello');
    //console.log('gBoard[i][j]', gBoard[i][j])
    if (startStopWatch===1){
        showStopWatch()
        startStopWatch = 0 
    }
    //showStopWatch()

    if (gBoard[i][j].isMine) { // if its a mine
        // update the model
        gBoard[i][j].isShown = true
        gLives--
        if (gLives===0)gameOver()
        
        

        // update the DOM
        elCell.innerHTML = BOMB
        var lives = document.querySelector('h1 span')
        lives.innerText = gLives
    }

    if (!gBoard[i][j].isMine) { // if its a number
        // update the model
        gBoard[i][j].isShown = true

        // update the DOM
        elCell.innerHTML = gBoard[i][j].minesAroundCount

    }

    if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount === 0) { // if its a empty cell

        //expandShown(gBoard, elCell, i, j)
        //gBoard[i][j].isShown = true


        //renderBoard(board)

    }

}

function expandShown(board, elCell, rowIdx, colIdx) {


    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            // update the model
            currCell.isShown = true


            if(currCell.minesAroundCount != 0 ){ // 
                elCell.innerHTML = currCell.minesAroundCount
            }else {
                elCell.innerHTML = EMPTY
            }
        }
        //renderBoard(gBoard)
    }
    //return count


}


function gameOver() {
    console.log('Game Over')

    var elButton = document.querySelector('button')
    elButton.innerText = '😱'

    var stopWatch = document.querySelector('.stopWatch span')
    stopWatch.innerText = ''

    gGame.isOn = false
    gGame.score = 0
    //clearInterval(gIntervalGhosts)
    //document.querySelector('button').style.display = 'block'
    clearInterval(gtimerInterval)


}
function renderCell(i, j, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function setMinesNegsCount(board){
    var counter = 0 
    for (var rowIdx = 0; rowIdx < gLevel.SIZE; rowIdx++) {
        for (var colIdx = 0; colIdx < gLevel.SIZE; colIdx++) {
            var counter = countActiveNegs(board, rowIdx, colIdx)
            board[rowIdx][colIdx].minesAroundCount = counter
        }
    }
}

function countActiveNegs(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}
// function countActiveNegs(board, rowIdx, colIdx) {


//     var count = 0
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= gLevel.SIZE) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= gLevel.SIZE) continue
//             var currCell = board[i][j]
//             if (currCell.isMine) board[rowIdx][colIdx].minesAroundCount++
//         }
//     }
// }








function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function showStopWatch() {
    var stopWatch = document.querySelector('.stopWatch span')
    var start = Date.now()
  
    gtimerInterval = setInterval(function () {
      var currTs = Date.now()
  
      var secs = parseInt((currTs - start) / 1000)

      stopWatch.innerText = ` ${secs}`
    }, 100)
  }

  


  function livesCount(){
    var lives = document.querySelector('h1 span')
    lives.innerText = gLives

  }