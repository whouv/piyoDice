function (user, body){

	function Dice(number){
		var dice = Math.floor( Math.random() * number ) + 1;
		return dice;
	}

	function ineq_adapter(mozi){
		mozi = mozi.replace(/��/g,">=");
		mozi = mozi.replace(/��/g,"<=");
		mozi = mozi.replace(/��/g,"<");
		mozi = mozi.replace(/��/g,">");
		mozi = mozi.replace(/[=��]/g,"+=");
		//�����s�����̓���+������
		mozi = mozi.replace(/>\+/g,">");
		mozi = mozi.replace(/<\+/g,"<");
		mozi = mozi.replace(/=>/g,">=");
		mozi = mozi.replace(/=</g,"<=");
		mozi = mozi.replace(/</g,"+<");
		mozi = mozi.replace(/>/g,"+>");
		return mozi;
	}
	function ineq_identifier(mozi){
		if(mozi.match(/^<=/)){
			return 2;
		}else if(mozi.match(/^>=/)){
			return 4;
		}else if(mozi.match(/^=/)){
			return 3;
		}else if(mozi.match(/^</)){
			return 1;
		}else if(mozi.match(/^>/)){
			return 5;
		}
		return 0;
	}
	function ineq_char(param_eq){
		var noneqArray =["","<","<=","=",">=",">"];
		return noneqArray[param_eq];
	}
	function ineq_judge(param_eq, total, num_achieve){
		var judgeResult = 0;
		if(param_eq == 1){
			if(total < num_achieve){
				judgeResult = 1;
			}else{
				judgeResult = 0;
			}
		}else if(param_eq == 2){
			if(total <= num_achieve){
				judgeResult = 1;
			}else{
				judgeResult = 0;
			}
		}else if(param_eq == 3){
			if(total == num_achieve){
				judgeResult = 1;
			}else{
				judgeResult = 0;
			}
		}else if(param_eq == 4){
			if(total >= num_achieve){
				judgeResult = 1;
			}else{
				judgeResult = 0;
			}
		}else if(param_eq == 5){
			if(total > num_achieve){
				judgeResult = 1;
			}else{
				judgeResult = 0;
			}
		}
		return judgeResult;
	}
	//�������i�������[�v�h�~���j

	//Bot���Ԃ��������ɂ͔������Ȃ�
	if (body.match(/^�� /)) return;
	//�Y���Ȃ���������Ԃ�
	if (body.match(/(\n|^)(\d*?[rR���q])??[\s�@]??[\d\-�|�]�{\+]*?\d*?[dD���c]\d*/) == null) {
		if(body.match(/^[cC���b][hH���g][oO���n][iI���h][cC���b][Ee�d��][\s�@]/) == null ){
			if(body.match(/^\d+[Bb�a��]\d+/) == null){
				return;
			}
		}
	}
	if (body.match(/(\n|^)(\d*?[rR���q])??[\s�@]??[\d\-�|�]�{\+]*?\d*?[dD���c]\d*[^\s\d\+\-�{�|�]�@>=<����������]/)) return;
	if (body.match(/(\n|^)3[r��R�q][d��D�c][^\d*\s�@]/)) return;
	if (user == "skype_webchat") {
		bodytemp = body.split(/����̔����F[\n\r]*?/, 2);
		user = bodytemp[0].split(" ")[1];
		body = bodytemp[1];
	}

	//�s���Ƃɕ���
	line = body.split(/(\n|\r|\n\r)/);
	var linetemp = "";
	var inlinetemp = "";
	var output = "";
	var flag_calc = false;
	var flag_kcrpg = true;//�͂���RPG�p�X�y�V�����t�@���u���p�t���O

	//�s�����̌J��Ԃ��w��Ffor_g

	for (g = 0; g < line.length; g++){

		//���莮�̂���s�̏������J�n�Fif_line[g]

		if (line[g].match(/^(\d*?[rR���q])?[\s�@]??[\d\-�|�]�{\+]*?\d*?[dD���c]\d*?/)){
			//����񐔂��擾

			var repeat = 1;
			if (line[g].match(/^\d*?[rR���q]/)){
				line[g] = line[g].replace(/[rR���q]/,"��");
				line[g] = line[g].replace(/^��/,"1��");
				inline = line[g].split("��");
				if (repeat =! "") repeat = inline[0];
				line[g] = inline[1];
				if (inline.length > 2) {
					for (e = 2; e < inline.length; e++){
						line[g] =+ "��" + inline[e];
					}
				}
				line[g] = line[g].replace(/^[\s�@]/, "");
			}

			//����񐔕��̌J��Ԃ��w��Ffor_h

			for (h = 1; h <= repeat; h++){

				line[g] = line[g].replace(/[\-�|�]]/g,"+-");
				line[g] = line[g].replace(/�@/g," ");

				line[g] = ineq_adapter(line[g]);				

				//�s���u���b�N���ɕ���

				block = line[g].split(" ");

				var comtemp = "";
				var comment = "";
				var ordinal = "";
				if (repeat > 1) ordinal = h + ' ';

				//�u���b�N�������̌J��Ԃ��w��Ffor_i

			//�����s���� non:0 <:1 <=:2 =:3 >=:4 >:5
				var param_eq = 0;
				var num_achieve = 0; //�ڕW�l
				var flag_special=false;
				var flag_fumble=false;

				for (i = 0; i < block.length; i++){
				//if (block[i].match(/[^\d\+\-\,�c��Dd�A�C]/)){
					//���R����u���b�N�������Fif_block[i]
					if (i > 0){
						comtemp = block[i] + " ";
						comment += comtemp;
					//���莮�u���b�N�̏������J�n�Felse_block[i]
				//} else if (block[i].match(/[\d�c��Dd\+\-�A�C\,]/)) {
					} else if (i == 0 && block[i].match(/[\d�c��Dd\+\-]/)) {

						block[i] = block[i].replace(/[�c��d]/g,"D");

						//���莮�����했�ɕ���

						temp = block[i].split(/\+/);

						var diceResult = "";
						var result = "";
						var total = 0;
						var fixed = 0;
						var detail = "";
						var fixedabs = 0;
						var totaltemp = 0;
						var X = 1;
						var Y = 6;
						var flag_d66 = false;//d66���o�p

						//���했�����̌J��Ԃ��w��Ffor_j

						for (j = 0; j < temp.length; j++){

							var pmnum = 1;
							var pmsign = "�{";
							var rolltemp = 0;
							var detailtemp = [];
							var fixedtemp = 0;

							//�_�C�X���̏������J�n�Fif_temp[j]_D

							if (temp[j].match("D")){
								temp[j] = temp[j].replace(/[�A�C]/g,",");

								//�_�C�X���w�c�x����A�w�Ƃx�𒊏o�B�܂��ȗ����̏�����

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
									pmsign = "�|";
								}

								if (Y == "") Y = 6;
								if (isNaN(Y)) X=0;

								//�_�C�X���̌��ʂ�����
								//piyo! thisdie�͐��l�Adetaildie�͕�����
								for (z = 1; z <= X; z++){
									var thisdie = 0;
									var detaildie = "";
									if (flag_d66 && Y == 66) {
										//d66����
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
										//�ʏ폈��
										thisdie=Dice(Y);
										detaildie = thisdie;
									}
									rolltemp += thisdie;
									detailtemp.push(detaildie);
								}

								//special fumble����
								if(flag_kcrpg && X==2 && Y==6) {
									if(rolltemp == 12) {
										flag_special=true;
									}
									if(rolltemp ==2){
										flag_fumble = true;
									}
								}

//								detail = ' (' + detailtemp.sort(function compareNumbers(a, b) {return b - a;}) + ')';
//�o�ڂ��\�[�g���������́A���̍s�̓��̃X���b�V���������ĉ������B

//1d�݂̂ł����Ă�d66���[�h�̂ݏڍׂ�\������B
								detail =' ('+detailtemp+') ';
								if (X == 1) {
									detail = '';
									if(flag_d66 == true && Y == 66){
										detail = detailtemp;
									}
								}

								diceResult = diceResult + ' ' + pmsign + ' ' + X + 'D' + Y + ' : ' + rolltemp + detail;
								totaltemp += pmnum * rolltemp;

							//�Œ�l���������Felse_temp[j]_D

							} else {
								if (temp[j].match(/^(>|=|<|<=|>=)\d+/) && param_eq == 0){
									comtemp = temp[j] + " ";//param_eq num_achieve
									var cut_pos = 1;
									param_eq = ineq_identifier(temp[j]);
									if(param_eq == 2 || param_eq == 4) {
										cut_pos = 2;
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

							//���莮�̌��ʂ𓝍�

							total = totaltemp + fixed;

							if (fixed < 0){
								fixedabs = Math.abs(fixed);
								result = diceResult + ' �| ' + fixedabs;
							} else if (fixed > 0){
								result = diceResult + ' �{ ' + fixed;
							} else {
								result = diceResult;
							}//if_fixed

							result = result.replace(/^\s�{\s/, "");

						}//for_j

					}//else_block[i]

					//�_�C�X���u���b�N�̌��ʂ�����

					if(param_eq != 0){
						var judgeResult = "�҂�";
						//�����s���� non:0 <:1 <=:2 =:3 >=:4 >:5
						if(ineq_judge(param_eq, total, num_achieve) == 1){
							judgeResult = "����";
						}else{
							judgeResult = "���s";
						}
						if(param_eq == 4 || param_eq == 5){
							if(flag_special){
								judgeResult = "�X�y�V�����I";
							}
							if(flag_fumble){
								judgeResult = "�t�@���u���I";
							}
						}
						inlinetemp = '\n' + '�@' + comment + ordinal + '  (�҂�҂�c)   ' + result + '�@[ �v�F' + total +' ] ' + ineq_char(param_eq) + num_achieve +' '+ judgeResult;
						flag_calc = true;
					}else{//param_eq==0
						inlinetemp = '\n' + '�@' + comment + ordinal + '  (�҂�҂�c)   ' + result + '�@[ �v�F' + total + ' ]';
						flag_calc = true;
					}//if_param_eq
				}//for_i

				//���莮������s�̌��ʂ�����

				linetemp += inlinetemp;

			}//for_h

		//���ꔽ����������:else_line[g]
		//
		}else if(line[g].match(/^\d+[Bb�a��]\d+/) && line[g].match(/^\d+[Bb�a��]\d+[^\s\d�@>=<����������]/)==null){
			//XBY�̎���
			var comment = "";
			var txttemp;
			var X = 0;
			var Y = 0;
			var detail = "";
			var detailtemp = [];
			var total = 0;
			var param_eq = 0;
			var cut_pos = 1;
			var num_achieve = 0;
			line[g] = ineq_adapter(line[g]);
			line[g] = line[g].replace(/[b���a]/g,"B");
			txttemp = line[g].split(/[\s�@]/);

			for (cnt = 1; cnt < txttemp.length; cnt++){
				comment += " " + txttemp[cnt];
			}

			txttemp = txttemp[0].split(/[B\+]/);
			X = txttemp[0];
			Y = txttemp[1];

			if(txttemp.length >= 3){
				var comment_temp = "";
				param_eq = ineq_identifier(txttemp[2]);
				if(param_eq == 2 || param_eq ==4){
					cut_pos = 2;
				}
				num_achieve = txttemp[2].substr(cut_pos);
				if(isNaN(num_achieve)){
					comment_temp += txttemp[2];
					param_eq = 0;
				}
				for (cnt = 3;cnt < txttemp.length; cnt++){
					comment_temp += txttemp.length[cnt]
				}
			}

			for (cnt = 1; cnt <= X; cnt++){
				var dicetemp = 0;
				dicetemp = Dice(Y);
				detailtemp.push(dicetemp);
				if(param_eq >= 1){
					total += ineq_judge(param_eq, dicetemp, num_achieve);
				}
			}

			detail = ' (' + detailtemp + ')';
			
			if (param_eq >=1){
				linetemp += '\n�@' + comment + ' (�҂�҂�c) ' + X + 'B' + Y + ineq_char(param_eq) + num_achieve + ' : ' + total + detail;
			}else{
				linetemp += '\n�@' + comment + ' (�҂�҂�c) ' + X + 'B' + Y + ' : ' + detail;
			}
			flag_calc = true;
		}else if(line[g].match(/^[cC���b][hH���g][oO���n][iI���h][cC���b][Ee�d��][\s�@]/)){
			//choice�̎���
			var choiceElm;

			//�󔒂ŋ�؂�A�e�v�f�ɂ΂炷
			choiceElm = line[g].split(/[\s�@]/);
			if (choiceElm.length == 2) return;
			var numOfElm = choiceElm.length - 1
			var Y = Dice(numOfElm);
			linetemp += '\n' + '�@' + '�u�҂�H�v choice : ' + choiceElm[ Y ];
			flag_calc=true;
		//���R����݂̂̍s�̌��ʂ������Felse_line[g]
		} else {
			comment = line[g];
			linetemp +=  '\n' + '�@' + comment;
		}//else_line[g]

		//���ʂ𓝍�

		output = '�� ' + user + linetemp;

	}//for_g

//�������ʂ��o��

	if (output.match(/function\s\(user\,\sbody/)) return;
	if (!flag_calc) return;
	return output;

}