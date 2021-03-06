documentWidth=window.screen.availWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;

function getPosTop(i,j){
	return i*cellSideLength+cellSpace*(i+1);
}

function getPosLeft(i,j){
	return j*cellSideLength+cellSpace*(j+1);
}

function getNumberBackgroundColor(number){
	switch(number){
		case 2:return '#eee4da';break;
		case 4:return '#ede0c8';break;
		case 8:return '#f2b179';break;
		case 16:return '#f59563';break;
		case 32:return '#f67c5f';break;
		case 64:return '#f65e3b';break;
		case 128:return '#edcf72';break;
		case 256:return '#edcc61';break;
		case 512:return '#edc850';break;
		case 1024:return '#edc53f';break;
		case 2048:return '#edc22e';break;
		case 4096:return '#a6c';break;
		case 8192:return '#93c';break;
	}
	return 'black';
}

function getNumberColor(number){
	if (number<=4) {
		return '#776e65';
	}
	return '#f9f6f2';
}

//棋盘中是否还有空间
function noSpace(board){
	for (var i=0;i<4;i++) {
		for (var j=0;j<4;j++) {
			if (board[i][j]==0) {
				return false;   //棋盘中有空间
			}
		}
	}
	return true;  //棋盘中没有空间
}


function canMoveLeft(board){
	for (var i=0;i<4;i++) {
		for (var j=1;j<4;j++) {
			if (board[i][j]!=0) {
				if (board[i][j-1]==0 || board[i][j]==board[i][j-1]) {//左侧一格无数字或者左侧格子和自己数字相同则可以向左移动
					return true;
				}
			}
		}
	}
	return false;
}
function canMoveUp(board){
	for (var j=0;j<4;j++) {
		for (var i=1;i<4;i++) {
			if (board[i][j]!=0) {
				if (board[i-1][j]==0 || board[i][j]==board[i-1][j]) {//左侧一格无数字或者左侧格子和自己数字相同则可以向左移动
					return true;
				}
			}
		}
	}
	return false;
}
function canMoveRight(board){
	for (var i=0;i<4;i++) {
		for (var j=2;j>=0;j--) {
			if (board[i][j]!=0) {
				if (board[i][j+1]==0 || board[i][j]==board[i][j+1]) {//左侧一格无数字或者左侧格子和自己数字相同则可以向左移动
					return true;
				}
			}
		}
	}
	return false;
}
function canMoveDown(board){
	for (var j=0;j<4;j++) {
		for (var i=2;i>=0;i--) {
			if (board[i][j]!=0) {
				if (board[i+1][j]==0 || board[i][j]==board[i+1][j]) {//左侧一格无数字或者左侧格子和自己数字相同则可以向左移动
					return true;
				}
			}
		}
	}
	return false;
}

//移动过程中，判断水平方向是否有其他数字
function noBlockH(row,col1,col2,board){
	for (var i=col1+1;i<col2;i++) {
		if (board[row][i]!=0) {
			return false;
		}
	}
	return true;
}

//移动过程中，判断垂直方向是否有其他数字
function noBlockV(col,row1,row2,board){
	for (var i=row1+1;i<row2;i++) {
		if (board[i][col]!=0) {
			return false;
		}
	}
	return true;
}

function noMove(board){
	if (canMoveUp(board)|| canMoveRight(board) || canMoveLeft(board) || canMoveDown(board)  ) {
		return false;
	}
	return true;
}

function max(score){
	if (score>window.localStorage.getItem('best')) {
		return true;
	}
	return false;
}
