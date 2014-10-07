// commonClass
var twitterAPI = function(codeId, tweetText, change) {
	var timer = null,
		$twitter = $('#twitter'),
		twitterScript = null;

	$.get('/assets/js/sdk/TwitterAPI.js', function (script){
		twitterScript = eval(script);
		twitterAPI = function (codeId, tweetText, change){

			var data_url = "https://codeute.com/" + codeId,
				data_text = tweetText;

			$(function(){
				clearTimeout(timer);
				$twitter.html('');
				window['__twttrlr'] = false;
				timer = setTimeout(function () {
					$twitter.append("<a id='twitter-button' href='http://twitter.com/share' class='twitter-share-button' data-lang='ja' data-url='"+data_url+"' data-text='"+data_text+"' data-count='horizontal' data-hashtags='codeute'></a>").fadeIn("slow");
					twitterScript();
				}, 50)
			});
		}
		twitterAPI(codeId, tweetText, change);
	}, 'script');
};

function escapeHTML(val) {
  return $('<div>').text(val).html();
}

var GameStateController = function () {
	this.loadComplete = false;
	this.playing = false;
	this.paused = false;
	this.started = false;
	this.finished = false;
	this.escreen = $('#effectLayer');
	this.ef = {
		bar: this.escreen.find('.effect-bar'),
		start: this.escreen.find('.effect-start'),
		fin: this.escreen.find('.effect-fin'),
		mask: this.escreen.find('.effect-mask')
	}

	this.tweetTitle = $('title').text();
	// this.escreen = this.escreen.find('>div');
}
var gameEffectTimerFlg = 0, startEffectTimer = 0, finEffectTimer = 0;
GameStateController.prototype = {
	reset: function () {
		// コンボの部分初期化
		$('#statusBar').html('<span>&nbsp;</span>');

		// スタートエフェクト初期化
		clearTimeout(startEffectTimer);
		clearTimeout(finEffectTimer);
		
		this.ef.bar.removeClass('effect-bar-fadeout'),
		this.ef.start.removeClass('effect-start-fadein effect-start-fadeout');
		this.escreen.find('>').removeClass('effect-end');
		this.loadComplete = true;

		// フィニッシュエフェクト初期化
		this.ef.fin.removeClass('effect-fin-fadein effect-fin-fadeout');
		this.ef.mask.removeClass('show');

		var typingLayer = $('#typing');
		typingLayer.find('#resultLayer>div *').remove();
		typingLayer.find('>div').show(0);

		this.finished = false;
	},
	isPlaying: function () {
		return this.playing && !this.paused && this.started;
	},

	isPause: function () {
		return this.paused;
	},

	playing: function () {
		this.playing = true;
	},

	pause: function () {
		this.paused = true;
		tipController.hide();
	},

	start: function () {
		var that = this;
		that.playing = true;
		that.started = true;

		keyBoardController.painting( startElm.value );

		$('#viewLayer').addClass('playing');
		that.ef.bar.addClass('effect-bar-fadeout');
		//*
		that.ef.start.addClass('effect-start-fadein');

		startEffectTimer = setTimeout(function () {
			that.ef.start.addClass('effect-start-fadeout');

			startEffectTimer = setTimeout(function () {

				if (!gameEffectTimerFlg) {
					that.escreen.find('>').addClass('effect-end');
					typeLayer.focus();
				}
			}, 230);

		}, 200+400);
		/*/
		startEffectTimer = setTimeout(function () {
			that.escreen.find('>').addClass('effect-end');
			typeLayer.focus();

		}, 200+400);
		//*/
	},

	restart: function () {
		this.paused = false;
	},

	finish: function (dcon) {
		var that = this, dfd = $.Deferred();
		that.playing = false;
		that.finished = true;
		that.pause();

		gameRecord.stopCapture();

		that.escreen.find('>').removeClass('effect-end');
		that.ef.fin.addClass('effect-fin-fadein');

		finEffectTimer = gameEffectTimerFlg = setTimeout(function (){
			that.ef.fin.addClass('effect-fin-fadeout');

			finEffectTimer = setTimeout(function () {

				that.escreen.find('>').addClass('effect-end');
				dfd.resolve();
			}, 250);

		}, 200+500);

		that.ef.mask.addClass('show');

		// 各種計測
		gameRecord.calculating(dcon);

		return dfd.promise();
	}
/*
	,createKeywordHeatMap: function (tokens, speedAvg, speedMax) {

		var upperRange = (speedMax - speedAvg) / 255, lowerRange = speedAvg / 255;

		function getColorFromDiff(diff) {

			if (diff > 0) {
				diff /= lowerRange;

				return 'rgba(' + (255-diff|0) + ', ' + (255-diff|0) + ', 255, 0.9)';
			}

			if (diff < 0) {
				diff = -diff;
				diff /= upperRange;

				return 'rgba( 255, ' + (255-diff|0) + ', ' + (255-diff|0) + ', 0.9)';
			}
		}

		function getFontSizeFromMisscount(count) {
			return ((10 + count)/10) + 'em';
		}

		var res = "";
		
		res += '<table class="heatmap">';

		res += '<tbody>';

		for (var i in tokens) {
			var keyword = '';
			res += '<tr><td class="table keyword-heatmap">\n';

			for (var j = 0, len = tokens[i].speedMap.length; j < len; j++) {
				var color = getColorFromDiff( speedAvg - tokens[i].speedMap[j] );
				var fontSize = getFontSizeFromMisscount( tokens[i].missedMap[j] );

				fontSize = '16px';

				keyword += '<span style="color: ' + color + ';font-size: ' + fontSize + '">' + escapeHTML(tokens[i].key[j]) + '</span>';
			}

			res += keyword;

			res += '</td></tr>\n';
		}

		res += '</tbody>';
		res += '</table>';

		return res;
	},
*/

}


 

























var LoadingEffect = function (elm) {
	var loading = elm.find('#loadingLayer');

	return {
		show: function () {
			elm.css({
				'z-index': 100,
				'opacity':1
			}).fadeIn(250);
			loading.attr('id', 'loadingCircle');

			return this;
		},
		hide: function (callback) {
			elm.addClass('fadeout');
			setTimeout(function () {
				elm.css({
					'display': 'none',
					'z-index': -9999
				}).removeClass('fadeout');

				if ( typeof callback === 'function' ) {
					callback();
				}
			}, 600);
			loading.attr('id', 'loadingLayer');

			return this;
		}
	}
}


var GameLayerController = function (tipController) {
	this.playing = false;
	this.tokenizing = false;
	this.fincheck = false;
	this.tip = tipController;
	this.$ts = $('#typeLayer');
	this.$ms = $('#mirrorLayer');
	this.$save = $('.code-save');

	this.editTip = new PowerTipController($.powerTip, $('#viewLayer .ace_cursor' ), {
		manual        : true,
		placement     : 's',
		smartPlacement: true
	});
}
GameLayerController.prototype = {
	reset: function () {
		$('#code-body > div').addClass('hidden');
	},

	typing: function (callback) {
		this.reset();

		this.playing = true;
		viewLayer.setReadOnly(true); // 読み取り専用にする
		viewLayer.clearSelection();
		mirrorLayer.session.doc.setValue('');
		typeLayer.session.doc.setValue('');

		this.editTip.hide();
		this.tip.reset();

		this.$ts.removeClass('hidden').css({'z-index': 'auto'});
		this.$ms.removeClass('hidden').css({'z-index': 'auto'})
			.find('.ace_cursor-layer, .ace_marker-layer, .ace_gutter').css({'opacity': 0});

		$('#viewLayer').addClass('typing_view').removeClass('hidden bottom').addClass('full');
		$('#edit').css({
			'z-index': -1
		}).addClass('hidden');
		//*/

		setResize();
		if ( typeof callback === 'function' ) {
			callback(true);
		}
	},

	edit: function () {
		this.reset();

		this.playing = false;
		viewLayer.setReadOnly(false); // 読み取り専用を解除
		this.tip.reset();
		this.editTip.reset();
		this.$ts.addClass('hidden');
		this.$ms.addClass('hidden');

		$('#edit').removeClass('hidden').hide().fadeIn(400).css({'z-index': 'auto'});
		
		$('#viewLayer').removeClass('hidden typing_view full').addClass('bottom');
		this.$save.removeClass('disabled');

		setResize();
		viewLayer.focus();

		/* 最新版に対応させるための応急処置
		setTimeout(function () {
			viewLayer.session.bgTokenizer.start(0)
		}, 500);
		
		// */
	},

	// その他のモード
	checking: function () {
		this.$save.addClass('disabled');
		this.fincheck = false;
	},

	endCheck: function (finish) {
		this.$save.removeClass('disabled');

		if ( finish ) {
			this.fincheck = this.playing = true;
		}
	},

	// ゲーム終了時に呼び出される。
	gameFin: function () {
		this.playing = false;
		
		// とりあえずエディットモードにする
		this.edit();
	}
}


var CursorBlinkController = function (elm) {
	var cursor = elm,
		hiding = true,
		timer = 0,
		blink = function () {
			timer = setInterval(change, 500);
			return this;
		},
		change = function () {

			if ( hiding = !hiding ) {
				cursor.className = 'ace_cursor cursor-hidden';

			} else {
				cursor.className = 'ace_cursor';
			}
			return this;
		},
		reset = function () {
			clearInterval( timer );
			blink();

			if ( hiding ) {
				cursor.className = 'ace_cursor';
				hiding = false;
			}
			return this;
		}

	return {
		blink: blink,
		change: change,
		reset: reset
	}
}


// パワーチップ制御用
var PowerTipController = function (powerTip, elm, op) {
	this.elm = elm.powerTip(op);
	this.showing = false;
	this.powerTip = powerTip;
	//this.disp = $('#powerTip');
	this.cp = {};
	this.msg = '';
	this.msgList = {
		' ': '\u2423',
		'\n': '\u21b5'
	}
}
PowerTipController.prototype = {
	show: function (msg, cp) {
		// cpを比較
		if ( this.cp.row !== cp.row || this.cp.column !== cp.column || this.msg !== msg) {
			this.cp = cp;
			this.msg = msg;
			this.hide();
			this.elm.data('powertip', this.textConv( msg ) );
		}

		if ( !this.showing ) {
			this.showing = true;
			this.elm.powerTip('show');

			setTimeout(function (t) {
				t.reposition();
			}, 10, this);
		}

		return this;
	},

	hide: function () {
		if ( this.showing ) {
			this.showing = false;
			this.elm.powerTip('hide', true);
		}
		return this;
	},

	changeOp: function (op) {
		this.elm.powerTip( op );
		return this;
	},

	reposition: function () {
		if ( this.showing ) {
			this.elm.powerTip('reposition');
		}
		return this;
	},

	textConv: function (text) {
		//*
		if ( text in this.msgList ) {
			text = this.msgList[text];
		}
		// */

		/*
		text = text.charCodeAt(0);
		// */

		return text;
	},
	reset: function () {
		this.hide();
		this.cp = {};
		this.msg = '';

		return this;
	}
}


var DataController = function (data, startup, enteredNum, idxMap, keywordMap, arrInput) {
	this.Range = ace.require("ace/range").Range;
	this.data = data;
	this.length = data.length;
	this.index = 0;
	this.key = '';
	this.stock = [];
	this.arrInput = arrInput;
	this.str = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	
	this.idxMap = idxMap;
	this.keywordMap = keywordMap;
	this.enteredNum = enteredNum;
	this.startup = startup;

	// 成績関連
	this.captureTime = null;
}
DataController.prototype = {
	checkData: function () {
		var error = false, cp = { row: 0, column: 0 };
		var checkStr = new RegExp('[' + this.str + ']');

		for　(var i = 0, len = this.data.length-1; i < len; i++ ) {
			var elm = this.data[i];

			if ( !this.isOptionalChar(i) && elm.type !== 'enter' && !elm.value.match(checkStr) && !elm.value.match(/\\|\t/) ) {
				cp.row = elm.row;
				cp.column = elm.col;
				error = true;
				break;
			}
		}

		return { cp: cp, err: error }
	},

	checkRange: function ( idx ) {
		if ( idx < 0 ) {
			console.warn( 'Error. data index over MIN', idx );
			return 0;

		} else if ( idx > this.length-1 ) {
			console.warn( 'Error. data index over MAX', idx );
			return this.length-1;

		} else {
			return idx;
		}
	},

	mirrorVal: function (mirrorLayer, viewLayer) {
		var idx = 0, idxCache = 0,
			elm = {}, nextElm = {},
			mval = '', vval = '', // mirrorLayerとviewLayer
			// valのキャッシュ
			valcache = '',
			// viewLayer用に変換するためのRe
			vvalRe = /[^\t\n\[\]\(\)\{\}]/g;

		for (var i = 0, j = 0, len = this.arrInput.length; i < len; i++) {
			idx = idxCache = this.arrInput[i];

			valcache = mval = this.data[idx].value;
			vval = this.data[idx].type === 'support.php_tag' ? valcache :
					this.isOptionalChar(idx) ? ' ' : valcache.replace(vvalRe, ' ');

			// 中身のindexが連続していたら、まとめる
			for (var j = i; this.arrInput[++j] === ++idxCache && j < len;) {
				valcache = this.data[idxCache].value;

				mval += valcache;
				vval += this.data[idx].type === 'support.php_tag' ? valcache : 
					this.isOptionalChar(idxCache) ? ' ' : valcache.replace(vvalRe, ' ');

				i = j;
			}

			elm = this.data[idx];
			nextElm = this.data[ this.checkRange( idxCache ) ];

			var range = new this.Range(
				elm.row,
				elm.col,
				nextElm.row,
				nextElm.col
			);

			mirrorLayer.session.replace(range, mval);
			viewLayer.session.replace(range, vval);
		}

		this.arrInput = [];

		return this;
	},

	setCursor: function (cp, flg) {
		

		var row = cp.row,
			col = cp.column,
			len = this.data.length-1,
			idx    = 0,
			colCnt = 0,
			rowCnt = 0,
			rowIdx = 0,
			idxMap;

		// 対応する行までの、入力済みの行数をカウントする
		while ( idx < len && rowCnt < row ) {
			idxMap = this.idxMap[ [++rowIdx, 0] ],
			idx = idxMap !== undefined ? idxMap.idx : this.length;

			// 前の行の改行が入力済みかどうか
			if ( this.data[ idx && idx - 1 ].entered ) {
				rowCnt++;
			}
		}

		// 対応する列までの、入力済みの列数をカウントする
		while ( idx < len && colCnt < col ) {

			if ( this.data[idx++].entered ) {
				colCnt++;
			}
		}

		if (!flg) {
			this.index = idx;
			this.key   = this.data[idx].value;
		}

		
		return { row: this.data[idx].row, column: this.data[idx].col };
	},

	typed: function (idx) {
		var index = idx !== undefined ? this.checkRange( idx ) : this.index,
			that = this.that( index );

		if ( !that.entered && index !== this.length-1 ) {
			this.arrInput.push(index);
			that.entered = this.idxMap[ [that.row, 0] ].rowEnt = true;

			if ( that.type !== 'enter' && !this.isOptionalChar(index) ) {
				this.enteredNum++;
			}
		}
	},

	cursorNext: function (idx) {
		
		var row = 0, col = 0, len = idx !== undefined ? idx : this.index+1;

		if ( len >= this.length ) {
			len = this.length-1
		}

		for (var i = 0; i < len; i++) {
			
			if ( this.data[i].entered ) {

				if ( this.data[i].type === 'enter') {
					row++;
					col = 0;

				} else {
					col++;

				}
			}
		}
		
		return { row: row, column: col }

	},

	that: function (idx) {
		return this.data[ idx !== undefined ? this.checkRange( idx ) : this.index ];
	},

	compIndent: function () {
		

		for (var i = this.index, len = this.length-1; i < len; i++) {
			var type = this.data[i].type;

			if ( this.isOptionalChar(i) || type === 'enter' ) {
				this.typed(i);

			} else {
				--i;
				break;
			}
		}
		this.index = i;

		
		return this;
	},

	isLparen: function (idx) {
		return this.that( idx ).type === 'lparen';
	},

	isRparen: function (idx) {
		return this.that( idx ).type === 'rparen';
	},

	compPair: function () {
		var elm     = this.that(),
			address = elm.fpair || elm.rpair,
			elm2    = this.data[address];

		if ( address ) {
			this.typed( address )
			//elm2.overwrite = true;
		}

		return this;
	},

	output: function () {
		
		var res = '', elm,
			row = 0, col = 0, cursorNextEnd = this.index+1; // cursornextを組み込んだ

		// length-1にすると正常に終了しない
		for (var i = 0, len = this.data.length-1; i < len; i++) {
			elm = this.data[i];

			if ( elm.entered　) {
				res += elm.value;

				// cursorNextを組み込んだ
				if ( i < cursorNextEnd ) {

					if ( elm.type === 'enter' ) {
						row++;
						col = 0;

					} else {
						col++;
					}
				}
			}
		}

		
		return [res, { row: row, column: col }];
	},

	adjust: function () {
		
		var idxStock = [], fpair = 0, rpair = 0;

		// 直前の有効文字を取得する
		for (var i = this.checkRange( this.index-1 ); i > 0; i--) {
			if ( !this.isOptionalChar(i) ) break;
		}

		fpair = i;
		rpair = this.data[i].rpair;

		if ( this.isLparen( fpair ) && this.isRparen( rpair ) ) {

			// rpairからエンターまでのホワイトスペースを埋める
			for (var j = rpair - 1; j > 0 && this.isOptionalChar(j); j--) {
				idxStock.push(j);
			}
			
			// エンターだったらタイプ済みにする。
			if ( this.data[j].type === 'enter' ) {
				this.typed(j);

				// adjustできるときだけ、typedにする
				for (var i = 0, len = idxStock.length; i < len; i++) {
					this.typed( idxStock[i] );
				}
			}
		}

		
		return this;
	},

	isOptionalChar: function (idx, flg) {
		var i = idx !== undefined ? idx : this.index,
			type = this.data[i].type;

		// エンターもoptionalとカウントするフラグが立っていたら、実行
		if (flg && this.data[i].value === '\n') {
			return true;
		}

		return type === 'indent' || type === 'comment' || ( type !== 'required.space' && !type.match('string') && this.data[i].value === ' ' ) || type === 'support.php_tag';
	},

	passSpace: function (key) {
		
		var res  = false,
			i    = this.index,
			len  = this.data.length-1; 

		if ( this.isOptionalChar(i) ) {

			while ( i < len ) {
				this.stock.push(i); // 未入力のリストに追加

				if ( !this.isOptionalChar(++i) ) {
					break;
				}
			}
		}

		if ( key === this.data[i].value ) {
			res = true;
			this.index = i;
		}

		
		return res;
	},

	beauty: function () {
		

		for (var i = 0, len = this.stock.length; i < len; i++) {
			this.typed( this.stock[i] );
		}

		
		this.stock = [];
	},

	nextIndex: function (idx, correct) {
		
		var i   = idx === undefined ? this.index : this.checkRange(idx),
			len = this.length-1,
			prevIsEnter = false;

		// 正打して、前がエンターだったら、次はエンターは飛ばす
		if (correct) {
			prevIsEnter = this.that().value === '\n'
		}

		while ( i < len && this.isOptionalChar(i, prevIsEnter) ) {
			i++;
		}

		
		return i;
	},

	// 問題文を生成した時に、最初のゴミは入力済みにしておく
	startUp: function (idx) {
		
		var i   = idx === undefined ? this.index : this.checkRange(idx),
			len = this.length-1;
		
		while ( i < len && (this.isOptionalChar(i) || this.that(i).type === 'enter' ) ) {
			this.typed(i);
			i++;
		}

		
		return i;

	},

	nextTyped: function (key) {
		var i   = this.index,
			len = this.length-1,
			res = false;
		
		while ( i < len && !this.data[i].entered ) {
			i++;
		}

		if ( res = this.data[i].value === key && this.data[i].type !== 'enter' ) {
			this.index = i;
		}

		return res;
	},

	mCursor: function (cp) {
		cp.column && cp.column--;

		var idxMap = this.idxMap[ [cp.row, cp.column] ],
			idx = idxMap !== undefined ? idxMap.idx : this.length,
			elm = this.data[ idx ];

		while ( idx && !this.data[ --idx ].entered );

		idx = idx && (idx += 2) > this.length ? this.length : idx;

		return this.cursorNext(idx);
	},/*

	getWord: function (idx) {
		var i = idx, thisType = this.that( i ).type, res = '';

		if ( thisType === 'enter' ) {
			return '改行';

		} else if ( thisType === 'required.space' ) {
			return '半角スペース';
		}

		// 開始インデックスを求める
		while ( i && this.that(i-1).type === thisType ) {
			i--;
		}

		// 終了インデックスまでループしつつ、現在のidxだったら太くする
		while ( i < this.length-1 && this.that(i).type === thisType ) {

			// 対象の文字
			if ( i === idx ) {
				res += '<b>' + this.that(i).value + '</b>';

			// それ以外の文字
			} else {
				res += '<span>' + this.that(i).value + '</span>';

			}

			i++;
		}

		return res;
	},*/
/*
	missed: function (idx) {
		var dconIndex = idx !== undefined ? this.checkRange( idx ) : this.index,
			elm = this.data[ dconIndex ],
			wordIndex = 0;

		if ( elm.index in this.keywordMap ) {
			wordIndex = this.keywordMap[ elm.index ].dataIdxArr.indexOf( dconIndex );
			this.keywordMap[ elm.index ].missedMap[ wordIndex ]++;
			this.keywordMap[ elm.index ].missed++;
		}

		return this;
	},
	//*/
/*
	timeMapping: function (index, time) {
		var elm = this.data[ index ], wordIndex = 0;

		if ( elm.index in this.keywordMap ) {
			wordIndex = this.keywordMap[ elm.index ].dataIdxArr.indexOf( index );
			this.keywordMap[ elm.index ].speedMap[ wordIndex ] = time;
		}

		return this;
	},
/*
	getWordRanking: function () {
		var temp = [], res = [];

		// 重複キーワードを吸収していく
		for (var i in this.keywordMap) {

			// missedの処理
			var map = this.keywordMap[i];

			// 出現済みのキーワードの場合
			if ((map.key + '-') in temp) {

				// missedを結合
				temp[map.key + '-'].missed += map.missed;
				temp[map.key + '-'].entryNum++;

				// missedMap・speedMapを結合
				for (var j = 0, l = temp[map.key + '-'].missedMap.length; i < l; i++) {
					temp[map.key + '-'].missedMap[i] += map.missedMap[i];
					temp[map.key + '-'].speedMap[i] += map.speedMap[i];
				}

			//新規登場キーワード
			} else {
				temp[map.key + '-'] = {
					key: map.key,
					missed: map.missed,
					missedMap: map.missedMap.slice(0),
					speedMap: map.speedMap.slice(0),
					speedAvg: 0,
					speedMax: 0,
					entryNum: 1
				};
			}
		}

		// resにpushしながら、speedMapの平均を出す (色付け用ではなく、ランキングの材料)
		var totalSpeedAvg = 0, totalSpeedLength = 0, totalSpeedMax = 0;

		for(var i in temp) {
			var speedSum = 0, speedMax = 0;

			for (var j = 0, l = temp[i].speedMap.length; j < l; j++) {
				speedSum += temp[i].speedMap[j];

				if (speedMax < temp[i].speedMap[j]) {
					speedMax = temp[i].speedMap[j];
				}

				if (totalSpeedMax < temp[i].speedMap[j]) {
					totalSpeedMax = temp[i].speedMap[j];
				}

				totalSpeedLength++;
			}
			temp[i].speedAvg = Math.round((speedSum / l) * 100) / 100;
			temp[i].speedMax = speedMax;

			if (temp[i].speedMax) {
				res.push(temp[i]);
			}

			totalSpeedAvg += speedSum;
		}

		// とりあえず遅い順にソート
		res.sort(function(a,b){
			a = a.speedAvg;
			b = b.speedAvg;
			if( a < b ) return 1;
			if( a > b ) return -1;
			return 0;
		});

		for(var i in res) {
			console.log(res[i].key, res[i].speedAvg, res[i].speedMax, res[i].missed);
		}

		return [res, Math.round((totalSpeedAvg / totalSpeedLength) * 100) / 100, totalSpeedMax];
	},
// */

	checkNotEntered: function () {
		var res = false, row = 0, col = 0;

		for (var i = 0, len = this.data.length-1; i < len; i++) {

			if ( !this.isOptionalChar(i) && this.that(i).type !== 'enter' && !this.data[i].entered ) {
				res = {
					row: this.data[i].row,
					column: this.data[i].col
				};

				break;
			}

			if ( this.data[i].entered ) {

				if ( this.data[i].type === 'enter' ) {
					row++;
					col = 0;

				} else {
					col++;
				}
			}
		}

		return { row: row, column: col };
	}
/*
	outputIndex: function () {

		var str = '', idxCache = 0;

		for (var i = 0, len = this.data.length-1; i < len;) {
			str = '';

			while ( idxCache === this.data[i].index ) {

				if ( !this.isOptionalChar(i) && this.data[i].type !== 'enter' ) {
					str += this.data[i].value;
				}
				i++;
			}

			str && console.log(this.data[i].index, str);
			idxCache = this.data[i].index;

		}
	}*/
	
}
