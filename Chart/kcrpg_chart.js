function (user, body){

	function Dice(number){
		//引数チェック
		if(isNaN(number)) return "\n error : Dice : 'number' demands integer";
		var dice = Math.floor( Math.random() * number ) + 1;
		return dice;
	}
	function adjuster_d66(num){
		//d66の11-66を1~21に当てはめる関数
		//11-16 1-6
		//22-26 7-11
		//33-36 12-15
		//44-46 16-18
		//55,56 19,20
		//66    21
		if (isNaN(num)) return "\n error : adjuster_d66 : 'num' must be number from d66";
		var x=0;
		var y=0;
		x = Math.floor(num/10);
		y = Math.floor(num - x*10);
		if(x >= 1 && x <= 6 && y >= x && y <= 6){
			var return_num = (-x*x+13*x)/2 -6+y;
			return return_num;
		}
		return "\n error : adjuster_d66 : 'num' must be number from d66";
	}
	function random_chart_multi(chart_array, die, num_dice){
		//ランダムチャート用関数
		//chart_array:チャートの中身の配列
		//chart_array[0]:コマンド名
		//die:使用するサイコロの面数
		//num_dice:サイコロの数

		//返り値: "\n （ぴよぴよ…）コマンド名 : ダイス結果 ランダム選択内容"

		//die,num_diceが数値かどうかチェック。変だったら弾く
		if(isNaN(die)) die=0;
		if(isNaN(num_dice)) num_dice=0;
		if(die <= 0) return "\n error : random_chart : 'die' must be integer";
		if(num_dice <= 0) return "\n error : random_chart : 'num_dice' must be integer";

		//chart_arrayが配列であって、十分な要素数を持っているかチェック
		if ((chart_array instanceof Array) && (chart_array.length >= die * num_dice +1)){
			//問題なし
		}else{
			return "\n error : random_chart : 'chart_array' hasn't enough elements";
		}

		var total = 0;
		var detail = " ";
		var detailtemp = [];
		var return_line = "";
		
		for(cnt = 0; cnt < num_dice; cnt++){
			var thisdie = Dice(die);
			total += thisdie;
			detailtemp.push(thisdie);
		}//for cnt

		if(num_dice!=1) detail= ' (' + detailtemp + ') ';

		return_line = '\n　(ぴよぴよ…)　' + chart_array[0] + ' : ' + total + detail + chart_array[total];
		return return_line;
	}

	function random_chart(chart_array, die){
		return random_chart_multi(chart_array,die,1);
	}

//ここまで関数

	if(body.match(/^†/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/さんの発言：[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}
	var linetemp = "";
	var output = "";


	if(body.match(/^[mMｍＭ][oOＯｏ][fFＦｆ][uUＵｕ]/)&&body.match(/^[mMｍＭ][oOＯｏ][fFＦｆ][uUＵｕ][^\s　]/)==null){
		//テストコマンド : もふ

		//表用の配列を用意。1d6を想定。array[0]はコマンド名。
		var mofu_array = ["Mofu","もふ！","もふもふ","もふっもふっ","もふう…","もふん","もふ…zzz"];

		//random_chart(表の配列,サイコロの面数) サイコロは一個固定
		linetemp = random_chart(mofu_array,mofu_array.length-1);
	}

	if(body.match(/^HyperMofuMofu/) &&body.match(/^HyperMofuMofu[^\s　]/) == null ){
		//サンプルコマンド : はいぱーもふもふ

		//表用の配列を用意。array[0]はコマンド名。2d6を想定しているためmofu_array[1]は空
		var mofu_array = ["HyperMofuMofu","","もふ","もふふ","もふもふ","もふもふん","もふもふも？","もふもっふもふ","もふんもふもふ？","もふもふもふもふ…","もふーん！もふーん！","もふもふもふももふもふ","もふん…もふん…もふん…"];

		//ramdom_chart_multi(表の配列,サイコロの面数,サイコロの個数)
		linetemp = random_chart_multi(mofu_array,6,2);
	}

	if (linetemp=="") return;
	output = '† ' + user + linetemp;
	if (output.match(/function\s\(user\,\sbody/)) return;
	return output;
}