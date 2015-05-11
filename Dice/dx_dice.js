function (user, body){

	function Dice(number){
		var dice = Math.floor( Math.random() * number ) + 1;
		return dice;
	}
	
	//下処理
	//Botが返した文字には反応しない
	if (body.match(/^† /)) return;
	//該当なしだったら返す
	if (body.match(/(\n|^)(\d*[ｘＸxX])\d*/) == null) {
		return;
	}
	if (user == "skype_webchat") {
		bodytemp = body.split(/さんの発言：[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}

	line = body.split(/(\n|\r|\n\r)/);
	var linetemp = "";
	var inlinetemp = "";
	var output = "";
	var flag_calc = false;

	for(g = 0; g < line.length; g++){
		if(line[g].match(/^\d*[xXｘＸ]\d*/) && line[g].match(/^\d*[xXｘＸ]\d*[^\s　\d]/) == null){

			line[g] = line[g].replace(/[xｘＸ]/,"X");
			block = line[g].split(/(\s|　)/);
			var comment = "";
			var X = 1;
			var Y = 10;
			for (cnt=0; cnt < block.length; cnt++){
				if(cnt >= 1){
					comment+=' ' + block[cnt];
				}else{

					//ここからDice振り
					txttemp = block[cnt].split(/[X]/);
					X = txttemp[0];
					Y = txttemp[1];
					if(isNaN(X)) X = 1;
					if(isNaN(Y)) Y = 10;

					if(Y < 2 || Y > 12){
						return;
					}
					var Xtemp = X;
					var total = 0;
					var detail = "";
					var Xcnt = 0;
					var dicemax = 0;
					var flag_first = true;
					while(Xtemp > 0){
						Xcnt = 0;
						var detailtemp = [];
						dicemax = 0;
						for(i = 0;i < Xtemp; i++){
							//一つづつサイコロを振る
							var thisdie = Dice(10);
							if(thisdie >= Y){
								Xcnt++;
								dicemax = 10;
							}
							if(dicemax < thisdie){
								dicemax = thisdie;
							}
							detailtemp.push(thisdie);
						}//for Xtemp
						var detailmozi = "";
						if(Xtemp != 1) detailmozi = '(' + detailtemp + ')';
						detail +='+' + dicemax + detailmozi;
						if(flag_first){
							detail =' ' + dicemax + detailmozi;
							flag_first = false;
						}
						if(Xcnt > 0){
							detail += ' ぴっ！';
						}
						total += dicemax;
						Xtemp = Xcnt;
					}//while
				}
			}//block[cnt]
			linetemp += '\n ' + comment + ' (ぴよー…)' + X + 'X' + Y + ' : ' + total + ' ' + detail;
			flag_calc = true;
		}//end of Dice of nXm
	}//for line[g]
	output = '† '+ user + linetemp;

	if(flag_calc){
		return output;
	}else{
		return;
	}
}