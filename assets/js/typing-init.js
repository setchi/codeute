
var rootpath = '/codeute/';
var rootpath = '/';


//* ready
$(function(){
// */



windowResize = (function () {
	var timer = false, margin = 70;
	var container = document.getElementById('typingLayer'), header = $('header'), elm2 = $('#code-header');
	container.style.height = (window.innerHeight - (header.height() + elm2.height()) - margin ) + 'px';

	return function(padding) {
		padding = padding || 0;

		container.style.height = (window.innerHeight - (header.height() + elm2.height()) - margin ) - padding + 'px';
		setResize();
		tipController.reposition();
	}
}());


$(window).resize(function () {
	var timer = false;

	return function () {
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
	    	windowResize();
	    }, 50);
	}
}());







codeId = $('[data-code-id]').data('code-id');
twitterAPI(codeId, $('title').text());

// 閲覧数とプレイ数取得
$.post(rootpath + 'code/status/' + codeId + '.json', function (d) {
	if (!d['Error']) {
		$('.play-num').text(d['play_num']);
		$('.view-num').text(d['view_num']);
		$('.favorited-num').text(d['favorited_num']);
	}
});

var codeInfo = $('#typingLayer').data('code-info').split('/');

init(ace, {
	'code_language': codeInfo[0],
	'editor_theme': codeInfo[1],
	'font_size': codeInfo[2],
	'tip_color': codeInfo[3]
});




$('#statusBox').easydrag(); // キーボードのドラッグ

$('.nav > li').click(function () {
	var panel = $(this).find('a').attr('href');

	// ゲーム制御
	(panel === '#typing') ? gameState.restart() : gameState.pause();

	if (panel === '#ranking') {
		updateRankingTable();
	}
});

// ランキング登録
$(document).on('mousedown', '#rankingRegistBtn:not(.disabled)', function () {
	rankingRegister(codeId, gameRecord.result, $(this));

}).keydown( onKeydownInput ).keypress( onKeypressInput ).keyup( onKeyupInput ).mousedown(function () {
	if (gameState.finished) {
		$(window).focus();
	}
});

$('#mirrorLayer').mousedown( onScreenMousedownInput ).click( onScreenClickInput );
$('#effectLayer').mousedown( onScreenClickInput );

// エディタ部分 設定リセット
$('#modalcontents').find('.setting').find('.reset').click(function() {
	setting.read( aceTypingData.defaultset );
});



$('input[type="search"]').focus(function () {
	gameState.pause();

}).blur(function () {
	gameState.restart();
});
// エディタを生成
//init( ace );
// データを読み込んで反映
//setting.read( aceTypingData.setting );


//typeLayer.setKeyboardHandler('vim')

/*
	最新版の問題点
	なぜかchange時にTokenizerが自動更新されない。
	viewLayer.session.bgTokenizer.start()

	字句解析器の発火のタイミングが最小限になっている・・・・?
*/

//*
//$('#mirrorLayer, #typeLayer')

//* ready
});
// */
