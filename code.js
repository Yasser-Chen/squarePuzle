const   resolusionX = 6 ,// make this an odd number
        resolusionY = 13 ,
        speed       = 3  ,
        maxSlides = speed * ( resolusionX + 5 ) , // + 5 because we are humains and we can't instantly move to the other side
        center=parseInt(resolusionX/2),
        possibleSquares = [
            [
                {x:center , y:0} ,
                {x:center , y:1}
            ] 
            ,
            [
                {x:center , y:0},
                {x:center , y:1},   
                {x:center , y:2},
                {x:center+1 , y:2}
            ]
            ,
            [
                {x:center+1 , y:0},
                {x:center   , y:1},
                {x:center   , y:0},
                {x:center+1 , y:1}
            ]
        ] ,
        game = document.getElementById('game');


var majNextMove = function (e) {
    switch (e.key) {
        case 'ArrowRight':
            if(direction!=3){
                direction = 1 ;
            }
            break;
        case 'ArrowLeft':
            if(direction!=1){
                direction = 3 ;
            }
            break;
    }
    document.querySelector('body').onkeydown = ()=>{};
};

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
const rndInt = () =>  randomIntFromInterval(0, possibleSquares.length-1) ;

var gameCashedSquares = new Array() ;
for (let i = 0; i < resolusionX ; i++) {

    let row = document.createElement('div'),
    miniArray = [];
    
    for (let j = 0; j < resolusionY ; j++) {
        let column = document.createElement('div');
        column.classList.add("square");
        row.appendChild(column);
        miniArray [j] = column ;
    }
    gameCashedSquares[i] = miniArray ;
    game.appendChild(row);
}

let gameScoreBoard = document.createElement('div'),
    score = 0 ;
gameScoreBoard.classList.add('game-score-board');
gameScoreBoard.innerText = "0" ;
game.appendChild(gameScoreBoard);

function incrementScore(){
    score += 5 ;
    gameScoreBoard.innerText = '' ;
    setTimeout(() => {
        gameScoreBoard.innerText = "+"+score ;
        setTimeout(() => {
            gameScoreBoard.innerText = '' ;
            setTimeout(() => {
                gameScoreBoard.innerText = "+"+score ;
                setTimeout(() => {
                    gameScoreBoard.innerText = score ;
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}


var square = JSON.parse(JSON.stringify(possibleSquares[rndInt()])) ,
    createdElements = []    ,
    direction = 1           ; // 1 - 2 - 3 - 4 | 'right' | 'down' | 'left' | 'top'



function getSquare(x,y){
    for (const sq of createdElements) {
        if(sq){
           if(sq.x == x && sq.y == y ){
                return sq ;
           } 
        }
    }
    return null ;
}


function draw() {
    for (let i = 0; i < resolusionX ; i++) {
        for (let j = 0; j < resolusionY ; j++) {
            gameCashedSquares[i][j].classList.remove('piece');
            gameCashedSquares[i][j].classList.remove('square-validated');
        }
    }

    
    for (const sq of createdElements) {
        if(sq){
            gameCashedSquares[sq.x][sq.y].classList.add('square-validated');
        }
    }

    for (const sq of square) {
        if(sq){
            gameCashedSquares[sq.x][sq.y].classList.add('piece');
        }
    }

}

function isautoDestruct(){
    for (const sq of createdElements) {
        if(sq){
            if(sq.y == 0 ){
                return true ;
            } 
        }
    }
    return false ;
}


var gameMoves = 0 ;

const frames = setInterval(() => {  

    var canGoToLeft  = true  ,
        canGoToRight = true  ,
        canGoToDown  = false ;
        
    //GO DOWN
    outer1:
    for (const sq of square) {
        var sqErrorFound = null ;

        if(resolusionY - 1 == sq.y){
            canGoToDown = false ;
            break;
        } 
        for (const sqError of square) {
            if(sq.y+1 == sqError.y){
                sqErrorFound =  JSON.parse(JSON.stringify(sqError)) ;
                break;
            }
        }
        if(!sqErrorFound){
            for (let i = 0; i < createdElements.length; i++) {
                if(createdElements[i] && createdElements[i].x == sq.x && createdElements[i].y == sq.y +1){
                    canGoToDown = false ;
                    break outer1;
                }
            }
            canGoToDown = true ;
        }
    }
    //GO left
    outer2:
    for (const sq of square) {
        var sqErrorFound = null ;

        if(0 == sq.x){
            canGoToLeft = false ;
            break;
        } 
        for (const sqError of square) {
            if(sq.x-1 == sqError.x){
                sqErrorFound =  JSON.parse(JSON.stringify(sqError)) ;
                break;
            }
        }
        if(!sqErrorFound){
            for (let i = 0; i < createdElements.length; i++) {
                if(createdElements[i] && createdElements[i].y == sq.y && createdElements[i].x == sq.x -1){
                    canGoToLeft = false ;
                    break outer2;
                }
            }
            canGoToLeft = true ;
        }
    }
    //GO Right
    outer3:
    for (const sq of square) {
        var sqErrorFound = null ;

        if(resolusionX-1 == sq.x){
            canGoToRight = false ;
            break;
        } 
        for (const sqError of square) {
            if(sq.x+1 == sqError.x){
                sqErrorFound =  JSON.parse(JSON.stringify(sqError)) ;
                break;
            }
        }
        if(!sqErrorFound){
            for (let i = 0; i < createdElements.length; i++) {
                if(createdElements[i] && createdElements[i].y == sq.y  && createdElements[i].x == sq.x +1){
                    canGoToRight = false ;
                    break outer3;
                }
            }
            canGoToRight = true ;
        }
    }

    

    switch (direction) {
        case 1:
            if( canGoToRight ){
                for (const sq of square) {
                    sq.x ++;
                }
            }
            break;
        case 3:
            if( canGoToLeft ){
                for (const sq of square) {
                    sq.x --;
                }
            }
            break;
    }
    
    for (let i = 0; i < createdElements.length; i++) {
        if(createdElements[i] && createdElements[i].y != resolusionY - 1 ){
            var anotherSq = getSquare(createdElements[i].x,createdElements[i].y+1) ;
            if(!anotherSq){
                if(gameMoves == maxSlides){
                    createdElements[i].y ++ ;
                }
            }
        }
    }


    
        //checkfrCompleted set
        var checkingArray = {};
        for (const sq of createdElements) {
            if(sq){
                if(!(sq.y in checkingArray )){
                    checkingArray[sq.y] = {
                        sum     : 0 ,
                        elemToRm: []
                    };
                }
                checkingArray[sq.y].sum += 1 ;
                checkingArray[sq.y].elemToRm.push(sq);
            }
        }
        for (const [k,iter] of Object.entries(checkingArray)) {
            let counter = 0 ;
            if( iter.sum == resolusionX  ){
                for (const checkedMustRm of iter.elemToRm) {
                    for (let i = 0; i < createdElements.length; i++) {
                        if(createdElements[i]){
                            if(
                                createdElements[i].x == checkedMustRm.x
                                &&
                                createdElements[i].y == checkedMustRm.y
                                ){
                                    counter++;
                                    delete createdElements[i];
                                    if( counter == resolusionX ){
                                        incrementScore();
                                    }
                             }
                        }
                    }
                    // from createdElements inner objs : {}
                }
            }
        }


    if(canGoToDown){
        if(gameMoves == maxSlides){
            gameMoves = 0;
            for (const sq of square) {  
                sq.y ++;
            }
        }else{
            gameMoves ++;
        }
    }else{

        for (let i = 0; i < square.length; i++) {
            createdElements.push(square[i]);
        }

        //copying element
        square = JSON.parse(JSON.stringify(possibleSquares[rndInt()])) ;
    }

    direction = 0 ; 

    document.querySelector('body').onkeydown = majNextMove ;


    if(isautoDestruct()){
        clearInterval(frames);
        alert("GAME OVER");
        window.location.reload();
    }
    
    draw();

}, speed);
