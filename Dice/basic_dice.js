function (user, body){

	function Dice(number){
		var dice = Math.floor( Math.random() * number ) + 1;
		return dice;
	}

	//下処理（無限ループ防止等）

	//Botが返した文字には反応しない
	if (body.match(/^† /)) return;
	//該当なしだったら返す
	if (body.match(/(\n|^)(\d*?[rRｒＲ])??[\s　]??[\d\-－‐＋\+]*?\d*?[dDｄＤ]\d*/) == null) {
		if(body.match(/^[AaＡａ][CcＣｃ][TtＴｔ]/) == null){
			if(body.match(/^[YyＹｙ][UuＵｕ][MmＭｍ][EeＥｅ]/)==null) {
				if(body.match(/^[cCｃＣ][hHｈＨ][oOｏＯ][iIｉＩ][cCｃＣ][EeＥｅ][\s　]/) == null ){
					return;
				}
			}
		}
	}
	if (body.match(/(\n|^)(\d*?[rRｒＲ])??[\s　]??[\d\-－‐＋\+]*?\d*?[dDｄＤ]\d*[^\s\d\+\-＋－‐　>=<＞＝＜≦≧]/)) return;
	if (body.match(/(\n|^)3[rｒRＲ][dｄDＤ][^\d*\s　]/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/さんの発言：[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}

	//行を分割

	line = body.split(/(\n|\r|\n\r)/);
	var linetemp = "";
	var inlinetemp = "";
	var output = "";
	var flag_calc = false;
	var flag_kcrpg = true;//艦これRPG用スペシャルファンブル用フラグ

	//行数分の繰り返し指定：for_g

	for (g = 0; g < line.length; g++){

		//判定式のある行の処理を開始：if_line[g]

		if (line[g].match(/^(\d*?[rRｒＲ])?[\s　]??[\d\-－‐＋\+]*?\d*?[dDｄＤ]\d*?/)){
			//判定回数を取得

			var repeat = 1;
			if (line[g].match(/^\d*?[rRｒＲ]/)){
				line[g] = line[g].replace(/[rRｒＲ]/,"†");
				line[g] = line[g].replace(/^†/,"1†");
				inline = line[g].split("†");
				if (repeat =! "") repeat = inline[0];
				line[g] = inline[1];
				if (inline.length > 2) {
					for (e = 2; e < inline.length; e++){
						line[g] =+ "†" + inline[e];
					}
				}
				line[g] = line[g].replace(/^[\s　]/, "");
			}

			//判定回数分の繰り返し指定：for_h

			for (h = 1; h <= repeat; h++){

				line[g] = line[g].replace(/[\-－‐]/g,"+-");
				line[g] = line[g].replace(/　/g," ");

				//半角変換
				line[g] = line[g].replace(/≧/g,">=");
				line[g] = line[g].replace(/≦/g,"<=");
				line[g] = line[g].replace(/＜/g,"<");
				line[g] = line[g].replace(/＞/g,">");


				line[g] = line[g].replace(/[=＝]/g,"+=");
				//等号不等号の頭に+をつける

				line[g] = line[g].replace(/>\+/g,">");
				line[g] = line[g].replace(/<\+/g,"<");
				line[g] = line[g].replace(/=>/g,">=");
				line[g] = line[g].replace(/=</g,"<=");
				line[g] = line[g].replace(/</g,"+<");
				line[g] = line[g].replace(/>/g,"+>");

				//行をブロック毎に分割

				block = line[g].split(" ");

				var comtemp = "";
				var comment = "";
				var ordinal = "";
				if (repeat > 1) ordinal = h + ' ';

				//ブロック毎処理の繰り返し指定：for_i

			//等号不等号 non:0 <:1 <=:2 =:3 >=:4 >:5
				var param_eq = 0;
				var num_achieve = 0; //目標値
				var flag_special=false;
				var flag_fumble=false;

				for (i = 0; i < block.length; i++){
				//if (block[i].match(/[^\d\+\-\,ＤｄDd、，]/)){
					//自然言語ブロックを処理：if_block[i]
					if (i > 0){
						comtemp = block[i] + " ";
						comment += comtemp;
					//判定式ブロックの処理を開始：else_block[i]
				//} else if (block[i].match(/[\dＤｄDd\+\-、，\,]/)) {
					} else if (i == 0 && block[i].match(/[\dＤｄDd\+\-]/)) {

						block[i] = block[i].replace(/[Ｄｄd]/g,"D");

						//判定式を式種毎に分割

						temp = block[i].split(/\+/);

						var diceResult = "";
						var Result = "";
						var total = 0;
						var fixed = 0;
						var detail = "";
						var fixedabs = 0;
						var totaltemp = 0;
						var X = 1;
						var Y = 6;
						var flag_d66 = false;//d66検出用

						//式種毎処理の繰り返し指定：for_j

						for (j = 0; j < temp.length; j++){

							var pmnum = 1;
							var pmsign = "＋";
							var rolltemp = 0;
							var detailtemp = [];
							var fixedtemp = 0;

							//ダイス式の処理を開始：if_temp[j]_D

							if (temp[j].match("D")){
								temp[j] = temp[j].replace(/[、，]/g,",");

								//ダイス式ＸＤＹから、ＸとＹを抽出。また省略時の処理等

								var X = temp[j].split("D")[0];
								var Y = temp[j].split("D")[1];

								if (X == "") {
									X = 1;
									flag_d66 = true;
								}
								if (X == "-") X = -1;
								if (X < 0) {
									X = - X;
									pmnum = -1;
									pmsign = "－";
								}

								if (Y == "") Y = 6;
								if (isNaN(Y)) X=0;

								//ダイス式の結果を処理
								//piyo! thisdieは数値、detaildieは文字に
								for (z = 1; z <= X; z++){
									var thisdie = 0;
									var detaildie = "";
									if (flag_d66 && Y == 66) {
										//d66処理
										var die1 = Dice(6);
										var die2 = Dice(6);
										detaildie = "(" + die1 + "," + die2 + ")";
										if (die1>die2){
											var torima = die1;
											die1=die2;
											die2=torima;
										}
										thisdie=die1*10 + die2;
									}else{
										//通常処理
										thisdie=Dice(Y);
										detaildie = thisdie;
									}
									rolltemp += thisdie;
									detailtemp.push(detaildie);
								}

								//special fumble処理
								if(flag_kcrpg && X==2 && Y==6) {
									if(rolltemp == 12) {
										flag_special=true;
									}
									if(rolltemp ==2){
										flag_fumble = true;
									}
								}

//								detail = ' (' + detailtemp.sort(function compareNumbers(a, b) {return b - a;}) + ')';
//出目をソートしたい時は、↑の行の頭のスラッシュを消して下さい。

//1dのみであってもd66モードのみ詳細を表示する。
								detail =' ('+detailtemp+') ';
								if (X == 1) {
									detail = '';
									if(flag_d66 == true && Y == 66){
									detail = detailtemp;
									}
								}

								diceResult = diceResult + ' ' + pmsign + ' ' + X + 'D' + Y + ' : ' + rolltemp + detail;
								totaltemp += pmnum * rolltemp;

							//固定値式を処理：else_temp[j]_D

							} else {
								if (temp[j].match(/^(>|=|<|<=|>=)\d+/) && param_eq == 0){
									comtemp = temp[j] + " ";//param_eq num_achieve
									var cut_pos = 1;
									if(temp[j].match(/^<=/)){
										param_eq = 2;
										cut_pos = 2;
									}else if(temp[j].match(/^>=/)){
										param_eq = 4;
										cut_pos = 2;
									}else if(temp[j].match(/^=/)){
										param_eq = 3;
									}else if(temp[j].match(/^</)){
										param_eq = 1;
									}else if(temp[j].match(/^>/)){
										param_eq = 5;
									}
									temp[j]= temp[j].substring(cut_pos,temp[j].length);
									if(isNaN(num_achieve)) {
										param_eq = 0;
										comment += comtemp;
									}
									num_achieve = Number(temp[j]);
								}else if (temp[j].match(/[^\d\-]/)){
									comtemp = temp[j] + " ";
									comment += comtemp;
								} else {
									fixedtemp = Number(temp[j]);
									if (param_eq == 0){
										fixed += fixedtemp;
									}else{
										num_achieve += fixedtemp;
									}
								}
							}//else_temp[j]_D

							//判定式の結果を統合

							total = totaltemp + fixed;

							if (fixed < 0){
								fixedabs = Math.abs(fixed);
								result = diceResult + ' － ' + fixedabs;
							} else if (fixed > 0){
								result = diceResult + ' ＋ ' + fixed;
							} else {
								result = diceResult;
							}//if_fixed

							result = result.replace(/^\s＋\s/, "");

						}//for_j

					}//else_block[i]

					//ダイス式ブロックの結果を処理

					if(param_eq != 0){
						var judgeResult = "ぴよ";
						//等号不等号 non:0 <:1 <=:2 =:3 >=:4 >:5
						if(param_eq == 1){
							if(total < num_achieve){
								judgeResult = "成功";
							}else{
								judgeResult = "失敗";
							}
						}else if(param_eq == 2){
							if(total <= num_achieve){
								judgeResult = "成功";
							}else{
								judgeResult = "失敗";
							}
						}else if(param_eq == 3){
							if(total == num_achieve){
								judgeResult = "成功";
							}else{
								judgeResult = "失敗";
							}
						}else if(param_eq == 4){
							if(total >= num_achieve){
								if(flag_special){
									judgeResult = "スペシャル！";
								}else{
									judgeResult = "成功";
								}
							}else{
								if(flag_fumble){
									judgeResult = "ファンブル！";
								}else{
									judgeResult = "失敗";
								}
							}
						}else if(param_eq == 5){
							if(total > num_achieve){
								if(flag_special){
									judgeResult = "スペシャル！";
								}else{
									judgeResult = "成功";
								}
							}else{
								if(flag_fumble){
									judgeResult = "ファンブル！";
								}else{
									judgeResult = "失敗";
								}
							}
						}
						var noneqArray =["","<","<=","=",">=",">"];
						inlinetemp = '\n' + '　' + comment + ordinal + '  (ぴよぴよ…)   ' + result + '　[ 計：' + total +' ] ' + noneqArray[param_eq] + num_achieve +' '+ judgeResult;
						flag_calc = true;
					}else{//param_eq==0
						inlinetemp = '\n' + '　' + comment + ordinal + '  (ぴよぴよ…)   ' + result + '　[ 計：' + total + ' ]';
						flag_calc = true;
					}//if_param_eq
				}//for_i

				//判定式がある行の結果を処理

				linetemp += inlinetemp;

			}//for_h

		//特殊反応文字処理:else_line[g]
		//
		}else if(line[g].match(/^[AaＡａ][CcＣｃ][TtＴｔ]/)&&line[g].match(/^[AaＡａ][CcＣｃ][TtＴｔ][^\s　]/) == null){
			//アクシデント表の実装
			var Y = 6;
			var thisdie;
			thisdie = Dice(Y);
			var actarray = ["","良かった、何もなし。","意外な手応え。長所短所反転","大失態。判定したPCはに対する声援にチェック","にゃーん。判定したPCはフェイズ終了時まで-1。累積は-2まで。","おおっと大衝突。損傷1。艦隊戦中なら同航行序列のPCにも損傷1","やりすぎ！行動力1d6点消費。"];
			if(thisdie==6){
				var wasteMoveP = 0;
				wasteMoveP = Dice(Y);
				linetemp += '\n' + '　' + '  (ぴよぴよ…)   ACT : ' + thisdie + ' '+ actarray[thisdie] + ' 消費1d6 : '+　wasteMoveP;
			}else{
				linetemp += '\n' + '　' + '  (ぴよぴよ…)   ACT : ' + thisdie + ' '+ actarray[thisdie];
			}
			flag_calc=true;
		}else if(line[g].match(/^[YyＹｙ][UuＵｕ][MmＭｍ][EeＥｅ]/)&&line[g].match(/^[YyＹｙ][UuＵｕ][MmＭｍ][EeＥｅ][^\s　]/)==null){
			//夢見表の実装
			var thisdie;
			var die1;
			var die2;
			die1 = Dice(6);
			die2 = Dice(6);
			var detaildie = '(' + die1 + ',' + die2 + ')';
			if(die1 > die2){
				thisdie = die2*10 + die1;
			}else{
				thisdie = die1*10 + die2;
			}
			var dreamarray = [""];
			dreamarray[11] = "漆黒の世界";
			dreamarray[12] = "温かい手";
			dreamarray[13] = "祝砲";
			dreamarray[14] = "孤独な魂";
			dreamarray[15] = "忘れられない笑顔";
			dreamarray[16] = "恋";
			dreamarray[22] = "死神";
			dreamarray[23] = "誓い";
			dreamarray[24] = "裏切り";
			dreamarray[25] = "放課後";
			dreamarray[26] = "ごちそう";
			dreamarray[33] = "名もなき歌";
			dreamarray[34] = "炎の中の少女";
			dreamarray[35] = "秘密";
			dreamarray[36] = "心のふるさと";
			dreamarray[44] = "歪んだ鏡";
			dreamarray[45] = "喪失";
			dreamarray[46] = "哄笑";
			dreamarray[55] = "家族の肖像";
			dreamarray[56] = "復讐";
			dreamarray[66] = "婚礼";
			linetemp += '\n' + '　' + '（すやすや…）　夢見表 : ' + thisdie + ' ' + detaildie + ' ' + dreamarray[thisdie];
			flag_calc=true;
		}else if(line[g].match(/^[cCｃＣ][hHｈＨ][oOｏＯ][iIｉＩ][cCｃＣ][EeＥｅ][\s　]/)){
			//choiceの実装
			var choiceElm;

			//空白で区切り、各要素にばらす
			choiceElm = line[g].split(/[\s　]/);
			if (choiceElm.length == 2) return;
			var numOfElm = choiceElm.length - 1
			var Y = Dice(numOfElm);
			linetemp += '\n' + '　' + '「ぴよ？」 choice : ' + choiceElm[ Y ];
			flag_calc=true;
		//自然言語のみの行の結果を処理：else_line[g]
		} else {
			comment = line[g];
			linetemp +=  '\n' + '　' + comment;
		}//else_line[g]

		//結果を統合

		output = '† ' + user + linetemp;

	}//for_g

//統合結果を出力

	if (output.match(/function\s\(user\,\sbody/)) return;
	if (!flag_calc) return;
	return output;

}