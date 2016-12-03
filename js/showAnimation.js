//数字出现动画
function showNumberWithAnimation(i,j,randomNumber){
	var numberCell=$('#number-cell-'+i+'-'+j);
	numberCell.css('background-color',getNumberBackgroundColor(randomNumber));
	numberCell.css('color',getNumberColor(randomNumber));
	numberCell.text(randomNumber);
	
	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},100);
}

//移动动画
function showMoveAnimation(fromX,fromY,ToX,ToY,board){
	var numberCell=$('#number-cell-'+fromX+'-'+fromY);
	
	numberCell.animate({
		top:getPosTop(ToX,ToY),
		left:getPosLeft(ToX,ToY)
	},200);
	
}

function updateScore(score){
	$('.score-container').text(score);
}

function updateBestScore(score){
	$('.best-container').text(score);
}
