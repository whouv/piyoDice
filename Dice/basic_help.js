function (user , body){
	if(body.match(/^��/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/����̔����F[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}
	var linetemp = "";
	var output = "";
	if(body.match(/^[hH���g][eE���d][lL���k][pP���o]/)&&body.match(/^[hH���g][eE���d][lL���k][pP���o][^\s�@]/)==null){
		//help�R�}���h
		linetemp ='\n�u�҂�҂�`�I�҂҂��I�v' + '\n �@�\�ꗗ' + '\n�@nDm : dice�@�\(����t)' + '\n�@nBm : �o���U��@�\(����t)'
			+ '\n�@choice [A] [B]�c : �I���@�\' + '\n�@Help : �w���v�@�\'
			+ '\n *�͂���RPG*' + '\n�@ACT : �A�N�V�f���g�\' + '\n�@Yume : �����\'
			+ '\n *�_�u���N���X*' + '\n�@aXb : dice�@�\  a : �_�C�X���@b : �N���e�B�J���l';
	}
	if (linetemp=="") return;
	output = '�� ' + user + linetemp;
	if (output.match(/function\s\(user\,\sbody/)) return;
	return output;
}