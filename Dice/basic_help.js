function (user , body){
	if(body.match(/^๕/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/ณ๑ฬญพF[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}
	var linetemp = "";
	var output = "";
	if(body.match(/^[hHg][eEd][lLk][pPo]/)&&body.match(/^[hHg][eEd][lLk][pPo][^\s@]/)==null){
		//helpR}h
		linetemp ='\nuาๆาๆ`IาามIv' + '\n @\๊' + '\n@nDm : dice@\(ป่t)' + '\n@nBm : oU่@\(ป่t)'
			+ '\n@choice [A] [B]c : I๐@\' + '\n@Help : wv@\'
			+ '\n *อฑ๊RPG*' + '\n@ACT : ANVfg\' + '\n@Yume : ฒฉ\'
			+ '\n *_uNX*' + '\n@aXb : dice@\  a : _CXย@b : NeBJl';
	}
	if (linetemp=="") return;
	output = '๕ ' + user + linetemp;
	if (output.match(/function\s\(user\,\sbody/)) return;
	return output;
}