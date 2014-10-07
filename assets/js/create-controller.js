var debugTokenizer = 0;
var editor = null, EditScreenController, editScreenCon, windowResize;
var sendData = {}, submitted = false, dcon;




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
	editor.setValue( helloWorld[mode] );
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

	var worker = new Worker('assets/js/tokenizer-worker.js'),
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

	$.post('upload/code?' + (new Date().getTime()), {
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
			var resultText = '登録が完了しました！';

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