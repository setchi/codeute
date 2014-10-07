
//* ベンチマーク用
var Timer = function () {

	if (window.performance) {
		var startTime = window.performance.now(),
			stopTime  = 0,
			captureTime = startTime;

		return {
			stop: function () {
				stopTime = window.performance.now();
				return stopTime - startTime;
			},

			capture: function () {
				var cache = window.performance.now();
				cacheTime = cache - captureTime;
				captureTime = cache;
				return cacheTime;
			}
		}

	} else {
		var startTime = new Date(),
			stopTime  = 0,
			captureTime = startTime;

		return {
			stop: function () {
				stopTime = new Date();
				return stopTime - startTime;
			},

			capture: function () {
				var cache = new Date();
				cacheTime = cache - captureTime;
				captureTime = cache;
				return cacheTime;
			}
		}

	}
}
//*/


$(function () {


$('.sns-login').click(function () {
	$('<div></div>').css({
		'background-color': '#000',
		'top': '0px',
		'left': '0px',
		'opacity': 0,
		'position': 'fixed',
		'width': '100%',
		'height': '100%',
		'z-index': 9999
	}).appendTo('body');
});

$('input[type="search"]').typeahead({
	source: [
		'ABAP',
		'ActionScript',
		'Assembly x86',
		'C',
		'C++',
		'COBOL',
		'CoffeeScript',
		'C#',
		'CSS',
		'Clojure',
		'D',
		'Dart',
		'Erlang',
		'Forth',
		'Go',
		'Groovy',
		'Haskell',
		'Haxe',
		'HTML',
		'Java',
		'JavaScript',
		'JSX',
		'Lisp',
		'LSL',
		'Lua',
		'MATLAB',
		'MySQL',
		'Objective-C',
		'OCaml',
		'Pascal',
		'Perl',
		'PHP',
		'Prolog',
		'Python',
		'R',
		'Ruby',
		'Rust',
		'Scala',
		'Scheme',
		'ShellScript',
		'TypeScript',
		'VBScript',
		'Verilog',
		'XML',
		'XQuery'
	]
});


var $email = $('#email');
$email.modal({
	'keyboard': true,
	'backdrop': false,
	'show': false
});

$(document).mousedown(function () {
	var modal = document.getElementById('email');

	return function (e) {
		if ( !$.contains(modal, e.target) ) {
			$(modal).modal('hide');
		}
	}
}());

$('[href="#email"]').mousedown(function () {
	$email.find('textarea').focus();
	$email.find('.panel2').text('').hide();
	$email.find('.send').show();
	$email.find('.panel1').show();
})

$email.find('.send').click(function () {
	var sending = false;
		return function () {
		var message = $email.find('textarea').val();

		if (message && !sending) {
			sending = true;

			$.post('/email/send.json', {
				'body': message

			}, function (msg) {
				sending = false;
				$email.find('.panel1').hide();
				$email.find('.send').hide();
				$email.find('textarea').val('');
				$email.find('.panel2').text(msg['msg']).show();
			});
		}
	}
}());

$email.find('form').submit(function () {return false;})
 
// 設定変更時の処理
/*
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
				tooltip.attr('href', 'assets/css/powertip/jquery.powertip-' + color + '.min.css');
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
			aceTypingData.setting[key] = data;

			process[key]( data );
		}
	}
})();
*/




});
