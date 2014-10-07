
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

$(document).mousedown(function () {
	var modal = document.getElementById('settingModal');

	return function (e) {
		if ( !$.contains(modal, e.target) ) {
			$(modal).modal('hide');
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
	var lastSession = $('#last-session').html().split('/');
	setMode(lastSession[0]);

	return function () {
		setTheme(lastSession[1]);
		// setTheme('terminal');
		setFontSize(lastSession[2]);
		setTipColor(lastSession[3]);
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