// Global Area
var debug = 0, debugTokenizer = 0,

	setting, dcon, isTypeCursorChange = false,

	// レイヤー
	detailLayer ,
	viewLayer   , viewLayerSession,
	typeLayer   , typeLayerSession,
	mirrorLayer , mirrorLayerSession,

	// 共有クラス
	cursorController,
	loadingEffect,
	tipController,
	keyBoardController,
	statusBoxController,
	gameState,
	gameRecord,

	// 初期化関連
	aceColorMode,
	startElm,
	windowResize,
	codeId,
	codeTokens,
	viewLayerCode;


function init( ace, data ) {
	viewLayer = ace.edit('viewLayer');
	viewLayer.setReadOnly(true); // 読み取り専用
	viewLayer.setShowFoldWidgets(false); // 折り畳みを無効
	viewLayer.setShowPrintMargin(false);
	viewLayer.setDisplayIndentGuides(false); // インデントガイドを非表示
	viewLayer.setHighlightActiveLine(true); // 行の強調表示無効
	viewLayer.getSession().setUseSoftTabs(true); // タブを\tに変換してくれる
	viewLayer.session.setUseWorker(false);
	viewLayer.commands.addCommand({
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
	var powerTipReposition = function () {
		var timer = false;

		return function (e) {
		    if (timer !== false) {
		        clearTimeout(timer);
		    }
		    timer = setTimeout(function() {
					tipController.reposition();
		    }, 50);
		}
	}();

	viewLayer.session.on('changeScrollTop', powerTipReposition);
	viewLayer.session.on('changeScrollLeft', powerTipReposition);
	viewLayerCode = viewLayer.getValue();


	mirrorLayer = ace.edit('mirrorLayer');
	mirrorLayer.setReadOnly(true); // 読み取り専用
	mirrorLayer.setShowFoldWidgets(false); // 折り畳みを無効
	mirrorLayer.setShowPrintMargin(false);
	mirrorLayer.setDisplayIndentGuides(false); // インデントガイドを非表示
	mirrorLayer.setHighlightActiveLine(false); // 行の強調表示無効
	mirrorLayer.getSession().setUseSoftTabs(true); // タブを\tに変換してくれる
	mirrorLayer.session.setUseWorker(false);
	mirrorLayer.session.on('changeScrollTop', function (e) {
		
		var mirrorScrollTop = mirrorLayer.session.getScrollTop();

		// viewのほうをmirrorに合わせる。LayerSyncと逆
		if ( mirrorScrollTop !== viewLayer.session.getScrollTop() ) {
			viewLayer.session.setScrollTop( mirrorScrollTop );
		}

		
	});
	mirrorLayer.session.on('changeScrollLeft', function (e) {
		
		var mirrorScrollLeft = mirrorLayer.session.getScrollLeft();
		// viewのほうをmirrorに合わせる。LayerSyncと逆
		if ( mirrorScrollLeft !== viewLayer.session.getScrollLeft() ) {
			viewLayer.session.setScrollLeft( mirrorScrollLeft );
		}

		
	});

	typeLayer = ace.edit('typeLayer');
	typeLayer.setReadOnly(true); // 読み取り専用
	typeLayer.setShowFoldWidgets(false); // 折り畳みを無効
	typeLayer.setShowPrintMargin(false);
	typeLayer.setDisplayIndentGuides(false); // インデントガイドを非表示
	typeLayer.setHighlightActiveLine(false); // 行の強調表示無効
	typeLayer.getSession().setUseSoftTabs(true); // タブを\tに変換してくれる
	typeLayer.session.setUseWorker(false);
	// typeLayer.getKeyboardHandler("/assets/js/lib/ace/keyboard/emacs");
	typeLayer.commands.removeCommand('find');
	typeLayer.commands.addCommand({
	  Name : "savefile",
	  bindKey: {
	    win : "Ctrl-S",
	    mac : "Command-S"
	  },
	  exec: function(editor) {
	  	// Ctrl-S
	  }
	});
	typeLayer.selection.on('changeCursor', function (e) {
		
		if ( !isTypeCursorChange ) {
			cursorSyncAlign();
		}
		
	});

	//*
	detailLayer = ace.edit('detailLayer');
	detailLayer.setReadOnly(true); // 読み取り専用
	// detailLayer.renderer.setShowGutter(false);
	detailLayer.setDisplayIndentGuides(true); // インデントガイドを表示
	detailLayer.setHighlightActiveLine(true); // 行の強調表示有効
	detailLayer.setShowPrintMargin(false);
	detailLayer.setHighlightActiveLine(false); // 行の強調表示無効
	// detailLayer.setShowInvisibles(true);
	// $('#detailLayer').find('.ace_invisible:contains("·")').css('color', 'rgba(0, 0, 0, 0)');
	//*/

	//cursorController   = CursorBlinkController( $('#typeLayer .ace_cursor, #viewLayer .ace_cursor') ).blink(),
	gameState = new GameStateController();
	keyBoardController = new KeyboardController();
	cursorController   = CursorBlinkController( document.getElementsByClassName('ace_cursor')[0] ).blink();
	loadingEffect      = LoadingEffect( $('#loading') );
	tipController      = new PowerTipController( $.powerTip, $('#viewLayer .ace_cursor'), {
		// smartPlacement: true,
		manual        : true,
		placement     : 's'
	});

	// 見た目の初期化
	$('#mirrorLayer').find('.ace_cursor-layer, .ace_marker-layer, .ace_gutter').css('opacity', 0);

	// データ反映
	setMode(data['code_language']);
	setCode(viewLayer.getValue());
	setFontSize(data['font_size']);
	setTheme(data['editor_theme']);
	setTipColor(data['tip_color']);

	// tokenizerが更新した時
	viewLayer.session.on('tokenizerUpdate', function () {
		var timer = false;

		return function (e) {
			if (!gameState.loadComplete) {
			    if (timer !== false) {
			        clearTimeout(timer);
			    }
			    timer = setTimeout(function() {
			    	windowResize();

			    	try {
			    		codeTokens = viewLayer.session.bgTokenizer.lines.slice(0);
						newSentence();

			    	} catch(e) {
			    		location.reload();
			    	}
			    	
			    }, 300);
			}
		}
	}());
}

function LayerSyncAlign() {
	
	var viewScrollTop  = viewLayer.session.getScrollTop(),
		viewScrollLeft = viewLayer.session.getScrollLeft();
	if ( mirrorLayer.session.getScrollTop() !== viewScrollTop ) {
		mirrorLayer.session.setScrollTop( viewScrollTop );
	}
	if ( mirrorLayer.session.getScrollLeft() !== viewScrollLeft ) {
		mirrorLayer.session.setScrollLeft( viewScrollLeft );
	}
	
}

function cursorSyncAlign() {
	
	var typeLayerCp = typeLayer.getCursorPosition();
	var cp = dcon.setCursor(typeLayerCp, true);
	viewLayer.moveCursorToPosition( { row: cp.row, column: cp.column } );

	/*
	var viewScrollRow = viewLayer.session.getScrollTop() / GLOBAL_LINE_HEIGHT,
		typeScrollRow = typeLayer.session.getScrollTop() / GLOBAL_LINE_HEIGHT;

	/*   左右でスクロール位置が違う            && 左右で画面上の行の位置が違う
	if ( typeScrollRow !== viewScrollRow && typeLayerCp.row - typeScrollRow !== cp.row - viewScrollRow ) {
		viewLayer.session.setScrollTop( ( cp.row - typeLayerCp.row + typeScrollRow ) * GLOBAL_LINE_HEIGHT );
	}// */
	
	cursorController.reset();
	LayerSyncAlign();
	tipController.hide();
	isTypeCursorChange = false;
	
}

function setTheme(theme) {
	
	theme = "ace/theme/" + theme;
	mirrorLayer.setTheme( theme );
	viewLayer.setTheme( theme );
	typeLayer.setTheme( theme );
	detailLayer.setTheme( theme );
	
}

function setMode(mode) {
	
	// グローバルにある言語指定を変更
	mode = "ace/mode/" + mode;
	mirrorLayer.getSession().setMode( mode );
	viewLayer.getSession().setMode( mode );
	typeLayer.getSession().setMode( mode );
	detailLayer.getSession().setMode( mode );

	
}

function setFontSize(size) {
	
	size |= 0;
	typeLayer.setFontSize( size );
	viewLayer.setFontSize( size );
	mirrorLayer.setFontSize( size );
	detailLayer.setFontSize( 16 );
	$('#powerTip').css({
		'min-width': +size + 10,
		'font-size': +size+3
	});
	//$('<style>#combo{margin-top: -' + (size*3.02) + 'px;line-height: ' + (size*4) + 'px;}</style>').appendTo('head');

	
}

function setTipColor(color) {
	$('.powertip-css').attr('href', '../assets/css/powertip/jquery.powertip-' + color + '.min.css');
}

function setCode(code) {
	

	// ホワイトスペース統一
	code = code.replace(/\t/g, '    ').replace(/\u3000/g, '  ');
/*
	viewLayer.setValue('');
	viewLayer.setValue( code );
	//*/
	detailLayer.setValue( code );
	detailLayer.clearSelection();
	
	
}

function setResize() {
	viewLayer.resize();
	typeLayer.resize();
	mirrorLayer.resize();
}

function newSentence(flg) {
	console.log('Start.');

	typeLayer.setValue('');
	mirrorLayer.setValue('');

	function initialize() {
		startElm = dcon.that( dcon.startUp(0) );

		var cp       = { row: startElm.row, column: startElm.col },
			output   = dcon.output();

		mirrorLayer.session.setScrollTop( 0 );
		mirrorLayer.session.setScrollLeft( 0 );
		mirrorLayer.setValue( dcon.startup );
		dcon.mirrorVal( mirrorLayer, viewLayer );
		mirrorLayer.clearSelection();
		mirrorLayer.moveCursorToPosition( cp );

		typeLayer.session.setScrollTop( 0 );
		typeLayer.session.setScrollLeft( 0 );
		typeLayer.setValue( output[0] );
		typeLayer.moveCursorToPosition( cp );
		typeLayer.clearSelection();

		$('#viewLayer').removeClass('playing'); // 色を戻す
		viewLayer.setValue(viewLayerCode);
		viewLayer.session.setScrollTop( 0 );
		viewLayer.session.setScrollLeft( 0 );
		viewLayer.moveCursorToPosition( cp );
		viewLayer.clearSelection();

		keyBoardController.painting( startElm.value );
		
		setAceColorMode(viewLayer.getTheme().substr(10));
		
		setTimeout(function () {
			typeLayer.focus();
			LayerSyncAlign();
		}, 100);
	}

	if ( flg ) {
		initialize();

	} else {
		//loadingEffect.show();

		tokenizing(function (flg, data) {

			if ( flg === 'process' ) {
				// console.log(data + '%');
				return;

			} else if ( flg === 'finish' ) {
				// いろいろ初期化
				dcon = new DataController( data[0], data[1], data[2], data[3], data[4], data[5] );
				statusBoxController = new StatusBoxController();
				gameRecord = new GameRecord();
				gameState = new GameStateController();

				gameState.reset();
				initialize();
				loadingEffect.hide();

				console.log('Finish.');
			}
		});
	}
}

function tokenizing(callback) {

	var bench = Timer();

	var callBack = function (flg, data) {
		if ( typeof callback === 'function' ) {
			callback(flg, data);
		}
	}

	var data = tokenizer(
		codeTokens,
		nonPassList[ viewLayer.session.getMode().$id.substr(9) ] || false,
		debugTokenizer
	);

	callBack('finish', data);
/*
	var worker = new Worker('../assets/js/tokenizer.js'),
		sendData = JSON.stringify([
			viewLayer.session.bgTokenizer.lines,
			$passList[ viewLayer.session.getMode().$id.substr(9) ],
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
	//*/
}

function setAceColorMode(theme) {

	var brightTheme = [
		'active4d',
		'chrome',
		'clouds',
		'crimson_editor',
		'dawn',
		'dreamweaver',
		'eclipse',
		'github',
		'solarized_light',
		'textmate" selected="selected',
		'tomorrow',
		'lazy',
		'xcode'
	]

	type = ~brightTheme.indexOf(theme) ? 'white' : 'dark';
/*
	$('#viewLayer').css({
		'box-shadow': '0px 0px 7px 0px ' + $('#viewLayer').find('.ace_scroller').css('background-color')
	})
// */
	$('#effectLayer').find('[class^="effect-"]').addClass('effect-' + type);

	var $view = $('#viewLayer');
	// var detailLayerHeight = $view.find('.ace_line').height() * viewLayer.session.getLength();
	var detailLayerHeight = 19 * (viewLayer.session.getLength()-2);
	$('#detailLayer').height( detailLayerHeight );//.css('border', '3px solid ' + $view.find('.ace_gutter').css('background-color'));
	// キーボードの色
	statusBoxController.setMode(type);
}
