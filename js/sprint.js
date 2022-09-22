
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

var gLevel = {
    SIZE: 4,
    MINES: 2
};

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
const EMPTY = '🔳'
const COVERD = '🔲'

const winlSmiley = '😎'
const normalSmiley = '😃'
const loselSmiley = '😱'

var gtimerInterval = 0
var gLives = 1
var gBoard
var firstClick = 1


function initGame() {

    varInit()
    
    gBoard = createBoard()
    addBombsRandLocation(gBoard)
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)

    var stopWatch = document.querySelector('.stopWatch span')
    
    gGame.isOn = true

}

function varInit(){
    var elButton = document.querySelector('button')
    elButton.innerText = '😃'

    var stopWatch = document.querySelector('.stopWatch span')
    stopWatch.innerText = ''

    var score = document.querySelector('.score span')
    score.innerText = 0

    gGame.markedCount = 0
    gGame.shownCount = 0
    gLives = 3
    livesCount()

}

function chooseMode(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines

    varInit()

    clearInterval(gtimerInterval)
    firstClick = 1
    initGame()
}


function createBoard() {

    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {

        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                image: ''
            }
            board[i][j] = cell

        }
    }

    // for (var i = 0; i < gLevel.MINES; i++) {

    //     var randIdxI = getRandomIntInclusive(1, gLevel.SIZE - 1)
    //     var randIdxJ = getRandomIntInclusive(1, gLevel.SIZE - 1)
        
    //     board[randIdxI][randIdxJ].isMine = true
    // }
    return board
}



function renderBoard(board) {
    //console.log('renderBoard SIZE',gLevel.SIZE)

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < gLevel.SIZE; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {

            const cell = gBoard[i][j]
            if (cell.isShown) {
                if (cell.isMine && !cell.isMarked) { // if its a bomb
                    cell.image = BOMB
                } else if (cell.minesAroundCount === 0 && !cell.isMarked) { // if its empty 1
                    cell.image = EMPTY
                } else if (!cell.isMine && !cell.isMarked) { // if its not empty(got negs)
                    cell.image = cell.minesAroundCount
                } else if (cell.isMarked) { // if its a flag
                    cell.image = FLAG
                }
            }
            if (!cell.isShown) cell.image = COVERD

            strHTML += `<td  onmousedown="cellClicked(this, ${i}, ${j},event)" class="cell">${cell.image}

            </td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    var elTable = document.querySelector('table')
    elTable.innerHTML = strHTML
}


function cellClicked(elCell, i, j, event) { //Called when a cell (td) is clicked

    if (!gGame.isOn) return

    //"Right Click is disabled"
    document.addEventListener('contextmenu',
        event => event.preventDefault());

    var elEventButton = +event.button
    //check for right click of mouse for flags
    if (elEventButton === 2 && !gBoard[i][j].isMarked) {

        //modal
        gGame.markedCount++
        gBoard[i][j].isMarked = true
        gBoard[i][j].isShown = true
        //dom
        elCell.innerHTML = FLAG
        if(isOver()) gameOver()
        return


    } else if (elEventButton === 2 && gBoard[i][j].isMarked) {
        // modal
        gGame.markedCount--
        gBoard[i][j].isMarked = false
        gBoard[i][j].isShown = false
        //dom
        elCell.innerHTML = COVERD
        return
    }
    // if its flag and left click - dont do anything
    if (elEventButton === 0 && gBoard[i][j].isMarked) {
        console.log('hey')
        return

    }

    if (firstClick === 1) {
        showStopWatch()
        firstClick = 0
    }

    if (gBoard[i][j].isMine) { // if its a mine
        
        // update the model
        if(!gBoard[i][j].isShown) gLives--

        gBoard[i][j].isShown = true
                
        if (gLives === 0) gameOver()
        
        // update the DOM
        elCell.innerHTML = BOMB
        var lives = document.querySelector('h2 span')
        lives.innerText = gLives
    }
    
    if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) { // if its a number
        
        // update the model
        gGame.shownCount++
        updateScore()
        gBoard[i][j].isShown = true

        // update the DOM
        if (gBoard[i][j].minesAroundCount === 0){
            elCell.innerHTML = EMPTY
        }else{
            elCell.innerHTML = gBoard[i][j].minesAroundCount
        }
    }

    if (!gBoard[i][j].isMine &&
        gBoard[i][j].minesAroundCount === 0) { // if its a empty cell

        var counter = expandShown(gBoard, elCell, i, j)
        gGame.shownCount += counter//-1 becuase he update it before he enter expand func
        updateScore()
        renderBoard(gBoard)
    }

    if (isOver())gameOver()


}

function expandShown(board, elCell, rowIdx, colIdx) {

    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (!currCell.isMine && !currCell.isMarked )
                // update the model
                if (currCell.isShown) continue
                //count++
                else count++
                currCell.isShown = true
            // the dom update is outside of curr function
        }
    }
    return count
}

function showAllMines(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isMine){

                board[i][j].isShown = true
            } 
        }
    }
    renderBoard()
}



// o LOSE: when clicking a mine, all mines should be revealed
// o WIN: all the mines are flagged, and all the other cells are shown

function isOver(){
    return ((gGame.markedCount === gLevel.MINES ) &&
    (gLevel.SIZE*gLevel.SIZE - gGame.shownCount === gLevel.MINES))
}

function gameOver() {
    console.log('Game Over')
    
    if (isOver())
    {
        console.log('u win')
        var elButton = document.querySelector('button')
        elButton.innerText = winlSmiley
        
    }else{
        console.log('u lose')
        var elButton = document.querySelector('button')
        elButton.innerText = loselSmiley
        showAllMines(gBoard)
    }




    clearInterval(gtimerInterval)

    gGame.isOn = false
    gGame.score = 0


}


function setMinesNegsCount(board) {
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



function addBombsRandLocation(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        
        var randIdxI = getRandomIntInclusive(1, gLevel.SIZE - 1)
        var randIdxJ = getRandomIntInclusive(1, gLevel.SIZE - 1)
        
        board[randIdxI][randIdxJ].isMine = true
        //console.log('i:', randIdxI, 'j:', randIdxJ, board[randIdxI][randIdxJ])
    }
    
}



function livesCount() {
    //console.log('example',example)
    var lives = document.querySelector('h2 span')
    lives.innerText = gLives

}
function updateScore(){
    var score = document.querySelector('.score span')
    score.innerText = gGame.shownCount
}



/////////////////// utils ////////////////////

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



