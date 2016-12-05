var board=new Array();
var score=0;
var hasConflict=new Array();//此位置产生一次合并，就不能再连续合并了
var startX=0;
var startY=0;
var endX=0;
var endY=0;
var flag=true;
var bestScore=0;

$(document).ready(function(){
	prepareForMobile();
	if (window.localStorage.getItem('state')) {
		var arr=new Array();
		arr=JSON.parse(window.localStorage.getItem('state'));
		for (var i=0;i<4;i++) {
			board[i]=new Array();
			hasConflict[i]=new Array();
			for (var j=0;j<4;j++) {
				board[i][j]=arr[i][j];
				hasConflict[i][j]=false;
			}
		}
		flag=false;
		if (window.localStorage.getItem('best')!=null) {
			updateBestScore(window.localStorage.getItem('best'));
		}else
			updateBestScore(0);
		if (window.localStorage.getItem('score')!=null) {
			score=parseInt(window.localStorage.getItem('score'));
			updateScore(score);
		}else
			updateScore(0);
		updateBoardView();
		$('.game-message').css('display','none');
	}else{
		newGame();
	}
});

function prepareForMobile(){
	if (documentWidth>500) {
		gridContainerWidth=500;
		cellSideLength=100;
		cellSpace=20;
	}
	$('.grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('.grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('.grid-container').css('padding', cellSpace);
    $('.grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

//移动端触摸检测
document.addEventListener('touchstart',function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;
})

document.addEventListener('touchmove',function(event){
	event.preventDefault();//解决添加preventDefault后，touchstart不管用
})

document.addEventListener('touchend',function(event){
	endX=event.changedTouches[0].pageX;
	endY=event.changedTouches[0].pageY;
	
	var delX=startX-endX;
	var delY=startY-endY;
	
	if (Math.abs(delX)<0.1*documentWidth && Math.abs(delY)<0.1*documentWidth) {
		return;
	}
	
	if (Math.abs(delX)>Math.abs(delY)) {
		if (delX>0) {
			//left
			if (moveLeft()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,210);
			}
		}else{
			//right
			if (moveRight()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,210);
			}
		}
	}else{
		if (delY>0) {
			//up
			if (moveUp()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,210);
			}
		}else{
			//down
			if (moveDown()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,210);
			}
		}
	}
})

function newGame(){
	//初始化棋盘格
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i=0;i<4;i++) {
		board[i]=new Array();
		hasConflict[i]=new Array();
		for (var j=0;j<4;j++) {
			board[i][j]=0;
			hasConflict[i][j]=false;
		}
	}
	updateBoardView();
	score=0;
	$('.game-message').css('display','none');
	updateScore(score);
	flag=false;
	if (window.localStorage.getItem('best')!=null) {
		updateBestScore(window.localStorage.getItem('best'));
	}else
		updateBestScore(0);
}

function updateBoardView(){
	$(".number-cell").remove();
	for (var i=0;i<4;i++) {
		for (var j=0;j<4;j++) {
			var gridCell=$('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}
	for (var i=0;i<4;i++) {
		for (var j=0;j<4;j++) {
			$(".grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'" ></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			
			if(board[i][j]==0){  //不显现方块设为0，并放置在方块中心位置
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',(getPosTop(i,j)+cellSideLength/2));
				theNumberCell.css('left',(getPosLeft(i,j)+cellSideLength/2));
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				if (board[i][j]<128) {
					theNumberCell.css('font-size',0.6*cellSideLength+'px');
				}else if (board[i][j]<1024) {
					theNumberCell.css('font-size',0.5*cellSideLength+'px');
				}else{
					theNumberCell.css('font-size',0.4*cellSideLength+'px');
				}
			}
			hasConflict[i][j]=false;
		}
	}
	$('.number-cell').css('line-height',cellSideLength+'px');
}

//随机产生一个格子
function generateOneNumber(){
	if (noSpace(board)) {
		return false;
	}
	//随机一个位置
	var randomX=parseInt(Math.floor(Math.random()*4));  //0-3
	var randomY=parseInt(Math.floor(Math.random()*4));  //0-3
	
	var times=0;
	while(times<50){  //判断位置上是否有数字了
		if (board[randomX][randomY]==0) {
			break;
		}
		randomX=parseInt(Math.floor(Math.random()*4));
		randomY=parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if (times==50) {
		for (var i=0;i<4;i++) 
			for (var j=0;j<4;j++) {
				if (board[i][j]==0) {
					randomX=i;
					randomY=j;
				}
			}
	}
	//随机一个数字（2,4）
	var randomNumber=Math.random()>0.5?2:4;
	
	//在随机位置显示随机数字
	board[randomX][randomY]=randomNumber;
	
	showNumberWithAnimation(randomX,randomY,randomNumber);
	
	return true;
}

$(document).keydown(function(event){
	
	switch(event.keyCode){
		case 37://left
			event.preventDefault();//防止出现滚动条后，上下键的时候整个屏幕滚动
			if (moveLeft()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,300);
			}
			break;
		case 38://up
			event.preventDefault();//防止出现滚动条后，上下键的时候整个屏幕滚动
			if (moveUp()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,300);
			}
			break;
		case 39://right
			event.preventDefault();//防止出现滚动条后，上下键的时候整个屏幕滚动
			if (moveRight()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,300);
			}
			break;
		case 40://down
			event.preventDefault();//防止出现滚动条后，上下键的时候整个屏幕滚动
			if (moveDown()) {
				setTimeout(generateOneNumber,210);//让上一个动画执行完毕，再执行这个函数
				setTimeout(isGameOver,300);
			}
			break;
		default:
			break;
	}
});

function isGameOver(){
	window.localStorage.setItem('state',JSON.stringify(board));
	if (noSpace(board) && noMove(board)) {
		gameOver();
		window.localStorage.setItem('score',0);
	}
}

function gameOver(){
	$('.game-message').css('display','block');
	$('.lower').css('display','block');
	$('.win').css('display','none');
	window.localStorage.setItem('score',score);
}

function gameWin(s){
	if (!flag) {
		if (s==2048) {
			$('.game-message').css('display','block');
			$('.win').css('display','block');
			$('.lower').css('display','none');
		}
		$('.keep-playing-button').click(function(){
			$('.game-message').css('display','none');
		});
		flag=true;
	}
}

function moveLeft(){
	//判断是否能移动
	if (!canMoveLeft(board)) {
		return false;
	}
	
	for (var i=0;i<4;i++) {
		for (var j=1;j<4;j++) {
			if (board[i][j]!=0) {
				for (var k=0;k<j;k++) {
					if(board[i][k]==0 && noBlockH(i,k,j,board)){//从左边第一个开始检查，是否有数字并且中间无障碍
						//move
						showMoveAnimation(i,j,i,k,board);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if (board[i][k]==board[i][j] && noBlockH(i,k,j,board) && !hasConflict[i][k]) {//数字和本数字相同并且中间无障碍
						//move
						showMoveAnimation(i,j,i,k,board);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;
						score+=board[i][k];
						gameWin(board[i][k]);
						window.localStorage.setItem('score',score);
						updateScore(score);
						if (max(score)) {
							window.localStorage.setItem('best',score);
							updateBestScore(score);
						}
						hasConflict[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout(updateBoardView,200);
	
	return true;
}
function moveUp(){
	//判断是否能移动
	if (!canMoveUp(board)) {
		return false;
	}
	
	for (var j=0;j<4;j++) {
		for (var i=1;i<4;i++) {
			if (board[i][j]!=0) {
				for (var k=0;k<i;k++) {
					if(board[k][j]==0 && noBlockV(j,k,i,board)){//从左边第一个开始检查，是否有数字并且中间无障碍
						//move
						showMoveAnimation(i,j,k,j,board);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if (board[k][j]==board[i][j] && noBlockV(j,k,i,board) && !hasConflict[k][j]) {//数字和本数字相同并且中间无障碍
						//move
						showMoveAnimation(i,j,k,j,board);
						//add
						board[k][j]+=board[i][j];
						board[i][j]=0;
						score+=board[k][j];
						gameWin(board[k][j]);
						window.localStorage.setItem('score',score);
						updateScore(score);
						if (max(score)) {
							window.localStorage.setItem('best',score);
							updateBestScore(score);
						}
						hasConflict[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout(updateBoardView,200);
	
	return true;
}
function moveRight(){
	//判断是否能移动
	if (!canMoveRight(board)) {
		return false;
	}
	
	for (var i=0;i<4;i++) {
		for (var j=2;j>=0;j--) {
			if (board[i][j]!=0) {
				for (var k=3;k>j;k--) {
					if(board[i][k]==0 && noBlockH(i,j,k,board)){//从右边第一个开始检查，是否有数字并且中间无障碍
						//move
						showMoveAnimation(i,j,i,k,board);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if (board[i][k]==board[i][j] && noBlockH(i,j,k,board) && !hasConflict[i][k]) {//数字和本数字相同并且中间无障碍
						//move
						showMoveAnimation(i,j,i,k,board);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;
						score+=board[i][k];
						gameWin(board[i][k]);
						window.localStorage.setItem('score',score);
						updateScore(score);
						if (max(score)) {
							window.localStorage.setItem('best',score);
							updateBestScore(score);
						}
						hasConflict[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}
function moveDown(){
	//判断是否能移动
	if (!canMoveDown(board)) {
		return false;
	}
	for (var j=0;j<4;j++) {
		for (var i=2;i>=0;i--) {
			if (board[i][j]!=0) {
				for (var k=3;k>i;k--) {
					if(board[k][j]==0 && noBlockV(j,i,k,board)){//从左边第一个开始检查，是否有数字并且中间无障碍
						//move
						showMoveAnimation(i,j,k,j,board);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if (board[k][j]==board[i][j] && noBlockV(j,i,k,board) && !hasConflict[k][j]) {//数字和本数字相同并且中间无障碍
						//move
						showMoveAnimation(i,j,k,j,board);
						//add
						board[k][j]+=board[i][j];
						board[i][j]=0;
						score+=board[k][j];
						gameWin(board[k][j]);
						window.localStorage.setItem('score',score);
						updateScore(score);
						if (max(score)) {
							window.localStorage.setItem('best',score);
							updateBestScore(score);
						}
						hasConflict[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout(updateBoardView,200);
	
	return true;
}
