var debugTokenizer = 0;
var editor = null, EditScreenController, editScreenCon, windowResize;
var sendData = {}, submitted = false, dcon, codeId = '';




function init() {
	editor = ace.edit('editor'), editScreenCon = new EditScreenController();
	editor.setShowPrintMargin(false);
	editor.getSession().setUseSoftTabs(true); // タブを\tに変換してくれる
	editor.session.on('tokenizerUpdate', function (e) {
		if (!submitted) {
			editScreenCon.tokenizing = false;
			editScreenCon.checkFinish(true);
		}
	});
	editor.session.on('change', function (e) {
		if (!submitted) {
			editor.session.bgTokenizer.start(true);
			editScreenCon.tokenizing = true;
			editScreenCon.editTip.hide();
			editScreenCon.checkStart();
		}
	});
	editor.commands.addCommand({
	  Name : "savefile",
	  bindKey: {
	    win : "Ctrl-S",
	    mac : "Command-S"
	  },
	  exec: function(editor) {
	  	// Ctrl-S
	  }
	});
	// カーソル変更が追い付かず、位置がずれることがあるため、処理を遅らせる
	var editTipReposition = function () {
		var timer = false;

		return function (e) {
		    if (timer !== false) {
		        clearTimeout(timer);
		    }
		    timer = setTimeout(function() {
					editScreenCon.editTip.reposition();
					editor.resize();
		    }, 50);
		}
	}();

	editor.session.on('changeScrollTop', editTipReposition);
	editor.session.on('changeScrollLeft', editTipReposition);
	editor.session.on('changeMode', function () {
		$('#editor').css('opacity', 1);
	});
	editor.selection.on('changeCursor', function () {
		editScreenCon.editTip.hide();
	});

	windowResize = (function () {
		var container = document.getElementById('editor'),
			header = $('header'), elm2 = $('.hero-unit'),
			margin = 140;

		return function () {
			container.style.height = (document.documentElement.clientHeight - (header.height() + elm2.height()) - margin ) + 'px';
			editor.resize();
			editScreenCon.editTip.reposition();
		}
	})();
}

function setTheme(theme) {
	editor.setTheme( "ace/theme/" + theme );
	$('[data-setting="theme"]').val(theme);
}

function setMode(mode) {
	// グローバルにある言語指定を変更
	editor.getSession().setMode( "ace/mode/" + mode );
	editor.moveCursorTo(0, 0);
	editor.clearSelection();

	var $modeSelect = $('#mode').val(mode);

	var modeNickName = $modeSelect.find('[value="' + mode + '"]').html();

	$('#editingLang').text( modeNickName );
}

function setFontSize(val) {
	console.log('setFontSize', val)
	editor.setFontSize(+val);
	$('[data-setting="font-size"]').val(val);
}

function setTipColor(color) {
	$('.powertip-css').attr('href', 'assets/css/powertip/jquery.powertip-' + color + '.min.css');
	$('[data-setting="tooltip"]').val(color);
}







function tokenizing(callback) {

	var str = editor.getValue();

	// 文字数チェック max: 60000
	if (str.length >= 60000) {
		editScreenCon.checkFinish(true);
		alert('コードが長すぎます。');
		return;
		
	} else if (str.length < 20) {
		editScreenCon.checkFinish(true);
		alert('20文字以上のコードを入力してください。');
		return;
	}

	var bench = Timer();

	var callBack = function (flg, data) {
		if ( typeof callback === 'function' ) {
			callback(flg, data);
		}
	}

	var worker = new Worker('/assets/js/tokenizer-worker.js'),
		sendData = JSON.stringify([
			editor.session.bgTokenizer.lines,
			nonPassList[ editor.session.getMode().$id.substr(9) ],
			debugTokenizer
		]),
		data;

	worker.onmessage = function (event) {

		if ( event.data.type === 'process' ) {
			callBack('process', event.data.msg);
			return;

		} else if ( event.data.type === 'error' ) {
			console.warn('Failure! [' + event.data.msg + ']');
			return;

		} else if ( event.data.type === 'log' ) {
			console.log( event.data.msg );
			return;
		}

		data = JSON.parse( event.data.msg );

		console.log('Finish. ' + bench.stop() + 'ms');

		callBack('finish', data);
	}
	worker.postMessage( sendData );
}










function codeCheck(callback) {
	if (submitted) return false;

	editScreenCon.editTip.hide();

	if ( editScreenCon.finflg && !editScreenCon.tokenizing ) {

		var counter = 0;

		editScreenCon.checkStart();
		editor.setReadOnly(true);

		// var progressBar = $('#tokenizeProgress').find('.bar');
		var startBtn = $('.code-check');

		var checkStart = function () {
			tokenizing(function (flg, data) {
				
				if ( flg === 'finish' ) {

					try {
						dcon = new DataController( data[0], data[1], data[2], data[3], data[4], data[5] );
						var check = dcon.checkData();

						// エラー：全角文字が含まれていた
						if ( check.err ) {
							editor.session.setScrollTop( Infinity )
							editor.moveCursorToPosition( check.cp );
							editor.clearSelection();

							setTimeout(function () {
								editScreenCon.editTip.show('申し訳ありません。<br>現在、全角文字に対応していません。', check.cp);
								editor.focus();
							}, 100);
						
						}

						// 正常に終わったらコールバックを呼び出す
						if ( !check.err ) {
							if ( typeof callback === 'function' ) {
								// progressBar.css('width', 0 + '%');
								callback();
							}

						// エラーが出た
						} else {
							editScreenCon.checkFinish(false);
						}

					} catch (e) {
						console.log('CodeCheck Retry.');

						if (counter++ < 10) {
							checkStart();

						} else {
							alert('字句解析に失敗しました');
						}
					}

					startBtn.text(editScreenCon.saveStart)

				} else if ( flg === 'process' ) {
					// progressBar.css('width', data + '%');
					startBtn.text( '字句解析中... ' + data + '%' );
				}
			});
		}

		checkStart();
	};
};


function send() {
	if (submitted) return false;

	var form = $('#code-register'), tipColorList = {
        "dark": 0,
        "light": 0,
        "red": 0,
        "blue": 0,
        "green": 0,
        "orange": 0,
        "purple": 0,
        "yellow": 0
	}

	var tipColor = $('[data-setting="tooltip"]').val();
	// チップカラーが存在しなかったらデフォルト値(light)にする。
	if ( !(tipColor in tipColorList) ) {
		tipColor = 'light';
	}
	
	sendData = {
		'last_code_id': codeId,
		'last_language': codeId.split('/')[0],
		'last_code_num': codeId.split('/')[1],
		'editor_theme': editor.getTheme().substr(10),
		'code_language': editor.session.getMode().$id.substr(9),
		'font_size': editor.getFontSize(),
		'code': editor.getValue().replace(/\u3000/g, '  ').replace(/\t/g, '    '),
		'open': form.find('[data-input="open"]').val(),
		'title': form.find('[data-input="title"]').val(),
		'description': form.find('[data-input="description"]').val(),
		'tip_color': tipColor,
		'code_length': dcon.length - dcon.enteredNum
	};

	editScreenCon.checkFinish(true);
	form.find('[type="submit"]').click();
}

// 登録処理
$('#code-register').submit(function () {
	editScreenCon.checkStart(true);
	submitted = true;
	console.log(sendData, JSON.stringify(sendData));

	$.post('/upload/updatecode', {
		'data': JSON.stringify(sendData)

	}, function (d) {
		// console.log(d);

		// 登録失敗
		if (d.Error) {
			alert(d.message);
			editScreenCon.checkFinish(true);
			submitted = false;

		// 登録成功時
		} else {
			var resultText = '更新が完了しました！';

			if (d.open === 'private') {
				resultText += '(非公開)';
			}

			$('h2').text(resultText);
			$('fieldset').html( d.url.link(d.url) );
			$('#detailsetting').remove();

			editor.setReadOnly(true);
			editor.setDisplayIndentGuides(false); // インデントガイドを非表示

			windowResize();
		}
	}, 'JSON');

	return false;
});











































// クラス類
var EditScreenController = function () {
	this.playing = false;
	this.tokenizing = false;
	this.finflg = true;
	this.$save = $('.code-check');

	this.saveStart = '>> 登録';
	this.saveWait = '更新中...';

	this.editTip = new PowerTipController($.powerTip, $('#editor .ace_cursor' ), {
		manual        : true,
		placement     : 's',
		smartPlacement: true
	});
}
EditScreenController.prototype = {
	checkStart: function () {
		this.finflg = false;
		this.$save.addClass('disabled');
		this.$save.text(this.saveWait);
	},

	checkFinish: function (finish) {
		if (finish) {
			this.$save.removeClass('disabled');
			this.$save.text(this.saveStart);

			this.finflg = this.playing = true;
			this.editTip.hide();
		}
		editor.setReadOnly(false);
	}
}




































$(function () {







//　エディタの設定
init();




$(window).resize(function() {
	var timer = false;

	windowResize();

	return function() {
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
	    	windowResize();
	    }, 50);
	}
}());

// モーダルボックス初期化
$('#settingModal').modal({
	'keyboard': true,
	'backdrop': false,
	'show': false
});

$(document).mousedown(function (e) {
	var modal = document.getElementById('settingModal');

	return function (e) {
		if ( !$.contains(modal, e.target) ) {
			$('.modal').modal('hide');
		}
	}
}());


$('form').find('[data-input="open"]').change(function(){
	$('[data-input="title"]').focus();
	
}).end().find('[data-input="title"]').keydown(function (e) {
	var eCode = e.keyCode || e.charCode;
	if (eCode === 13) {
		$('[data-input="description"]').focus();
		return e.preventDefault();
	}
});



// エディターの設定
var settingReset = (function () {
	var codeData = $('#code-data').html().split('/');
	setMode(codeData[0]);
	$('form').find('[data-input="open"]').val(codeData[5]);

	codeId = codeData[0] + '/' + codeData[1];

	return function () {
		setTheme(codeData[2]);
		// setTheme('terminal');
		setFontSize(codeData[3]);
		setTipColor(codeData[4]);
	}
}());

settingReset();

// 言語を変更したとき
$('#mode').change(function() {
	editScreenCon.checkStart();
	var value = $(this).val();
	setMode(value);
});

// 次へ進むボタンを押したとき __TokenizeFinish
$('.code-check').click(function () {
	codeCheck(function () {

		console.log('__TokenizeFinish');
		send();
	});
});

$('.setting-reset').click(settingReset);




// 設定変更時の処理
$(document).on('change', '[data-setting]', function() {
	var key = $(this).data('setting'),
		value = $(this).val();
		setting.write(key, value);

});

var setting = (function () {
	var elements = $('[data-setting]'),
		tooltip = $('.powertip-css'),
		process = {
			'theme': function (theme) {
				setTheme( theme );
			},
			'font-size': function (size) {
				setFontSize( size );
			},
			'mode': function (mode) {
				setMode( mode );

			},
			'code': function (code) {
				setCode( code );
			},
			'tooltip': function (color) {
				setTipColor(color);
			}
		};

	return {
		read: function (data) {
			for (var i in data) {
				elements.filter('[data-setting="' + i + '"]').val( data[i] );
				process[i]( data[i] );
			}
		},
		write: function (key, data) {
			// ここでデータを更新する
			// aceTypingData.setting[key] = data;

			process[key]( data );
		}
	}
})();




});