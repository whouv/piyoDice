function (user , body){
	if(body.match(/^†/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/さんの発言：[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}
	var linetemp = "";
	var output = "";
	if(body.match(/^[hHｈＨ][eEｅＥ][lLｌＬ][pPｐＰ]/)&&body.match(/^[hHｈＨ][eEｅＥ][lLｌＬ][pPｐＰ][^\s　]/)==null){
		//helpコマンド
		linetemp ='\n「ぴよぴよ～！ぴぴっ！」' + '\n 機能一覧' + '\n　nDm : dice機能(判定付)' + '\n　nBm : バラ振り機能(判定付)'
			+ '\n　choice [A] [B]… : 選択機能' + '\n　Help : ヘルプ機能'
			+ '\n *艦これRPG*' + '\n　ACT : アクシデント表' + '\n　Yume : 夢見表'
			+ '\n *ダブルクロス*' + '\n　aXb : dice機能  a : ダイス個数　b : クリティカル値';
	}
	if (linetemp=="") return;
	output = '† ' + user + linetemp;
	if (output.match(/function\s\(user\,\sbody/)) return;
	return output;
}