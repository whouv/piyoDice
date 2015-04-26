function (user , body){

	function Dice(number){
		var dice = Math.floor( Math.random() * number ) + 1;
		return dice;
	}

	function random_chart(chart_array,die){
		//ランダムチャート用関数
		//chart_array:チャートの中身の配列
		//chart_array[0]:コマンド名
		//die:使用するサイコロの面数

		//返り値: "\n （ぴよぴよ…）コマンド名 : ダイス結果 ランダム選択内容"

		//chart_arrayが配列であって、十分な要素数を持っているかチェック
		if ((chart_array instanceof Array) && (chart_array.length >= die+1)){
			//問題なし
		}else{
			return "配列ミス？";
			//より良いエラー文がほしい。
		}

		var random_die = Dice(die);

		var return_line = "";
		return_line = '\n　(ぴよぴよ…）' + chart_array[0] + ' : ' + random_die + ' ' + chart_array[random_die];
		return return_line;
	}

	if(body.match(/^†/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/さんの発言：[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}
	var linetemp = "";
	var output = "";


	if(body.match(/^[mMｍＭ][oOＯｏ][fFＦｆ][uUＵｕ]/)&&body.match(/^[mMｍＭ][oOＯｏ][fFＦｆ][uUＵｕ][^\s　]/)==null){
		//テストコマンド:もふ
		var mofu_array = ["Mohu","もふ！","もふもふ","もふっもふっ","もふう…","もふん","もふ…zzz"];
		linetemp = random_chart(mofu_array,mofu_array.length-1);
	}
	if (linetemp=="") return;
	output = '† ' + user + linetemp;
	if (output.match(/function\s\(user\,\sbody/)) return;
	return output;
}