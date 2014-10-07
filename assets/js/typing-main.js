var keyPressPassFlg = false, cursorMovkeyCode = [37, 38, 39, 40, 8];

function onKeyupInput(e) {
	if (!gameState.loadComplete) return true;

	if (!keyBoardController.isShift) {
		keyBoardController.setShift(false);
	}
}

function onKeydownInput(e) {
	var keyCode = e.charCode || e.keyCode;

	// リプレイ時
	if ( keyCode === 27 ) {
		if (gameState.finished) {
			twitterAPI(codeId, gameState.tweetTitle);
		}
		newSentence(false);
	}

	// 結果画面
	if (gameState.finished) {

	// 結果画面以外
	} else {
		// 全半角チェック
		if ( keyCode === 229 || keyCode === 0 ) {
			statusBoxController.warning('半角で入力してください');
			return false;
		}

		keyPressPassFlg = false;

		if ( e.ctrlKey ) {

			// キーボードの表示非表示
			if ( keyCode === 83 ) {
				if (!gameState.finished) {
					keyBoardController.setKeyboardShow( !keyBoardController.hidden );
				}
				keyPressPassFlg = true;
				return false;
			}

			// ペースト禁止
			if ( keyCode === 86 ) return false;

			// 未入力チェック
			if ( keyCode === 13 ) {
				var notEntered = dcon.checkNotEntered();

				if (notEntered) {
					typeLayer.moveCursorToPosition( notEntered );
					typeLayer.clearSelection();
					tipController.show('未入力です', notEntered);

					keyPressPassFlg = true;
					return false;
				}
			}
		}

		if (e.shiftKey) {
			keyBoardController.setShift(true);
		}
	}
}

function onKeypressInput(e) {
	// ロード中 || ポーズ中 だったらリターン
	if (!gameState.loadComplete || gameState.isPause() || gameState.finished) return true;

	var BENCHMARK = Timer();

	var keyCode   = e.charCode || e.keyCode,
		key     = dcon.str[keyCode-32] || '',
		cp      = typeLayer.getCursorPosition(),
		correct = false;

	// スペースキーでゲームスタート
	if (!gameState.isPlaying()) {
		if (!gameState.started) {

			if (key === startElm.value) {
				gameState.start();
				
			} else {
				return true;
			}
		}
	}

	if (keyPressPassFlg) {
		keyPressPassFlg = false;
		return false;
	}

	// カーソル移動だったらはじく
	if (!e.shiftKey && ~cursorMovkeyCode.indexOf(keyCode)) {
		cursorController.reset();
		return false;
	}

	isTypeCursorChange = true;


	if (keyCode === 13) {
		key = '\n';
	}
	
	// 半角文字以外のとき
	if ( !key ) {
		return false;
	}

	dcon.setCursor(cp);

	var notEntered = !dcon.that().entered;
	
	// インデントだったらパススペースするのを追加
	correct = dcon.key === key && notEntered; //( notEntered || dcon.that().overwrite );

	if ( !correct ) {
		correct = dcon.passSpace(key);
	}

	if ( !correct ) {
		//correct = dcon.nextTyped(key);
	}
	
	// 成績をキャプチャ
	gameRecord.capture(dcon.index, correct, key);
	
	// 正タイプ時
	if ( correct ) {

		tipController.hide();
		dcon.typed();

		// 左かっこだったらペアの括弧を補完
		if ( dcon.isLparen() ) {
			dcon.compPair();
		}

		var beautyTrigger = {
			';':0,
			'}':0
		}

		var dconAfterElm = dcon.that( dcon.nextIndex( dcon.index+1, correct ) );

		// 改行だったら、インデントを補完
		if ( keyCode === 13 ) {
			dcon.adjust().compIndent().beauty();

		//          整形トリガ               && 文字列でない                    && 次の文字が改行
		} else if ( (key in beautyTrigger) && dcon.that().type !== 'string' && dconAfterElm.type === 'enter') {
			dcon.beauty();
		}

		var output = dcon.output();
		typeLayer.setValue( output[0] );
		typeLayer.moveCursorToPosition( output[1] );
		typeLayer.clearSelection();
		dcon.mirrorVal( mirrorLayer, viewLayer );
		cursorSyncAlign();

		// コンボ・キーボード更新
		statusBoxController.comboCount(correct, dcon.index);
		keyBoardController.painting( dconAfterElm.value );

		// ゲーム終了時
		if ( dcon.enteredNum === dcon.length ) {
/* total BENCHMARK
			var total = 0, cont = 0;
			for(var i in TEST){
				total += TEST[i];
				cont++;
			}
			console.log('total',total/cont);
// */

			var rankState = false;
			
			$.when(gameState.finish(dcon), $.post(rootpath + 'ranking/rank/' + codeId + '.json?' + (new Date().getTime()), gameRecord.getRecord(), function (d) {
				rankState = d;

			})).done(function () {
				drawResult(dcon, gameRecord, rankState);

			}).fail(function () {
				drawResult(dcon, gameRecord, {
					'Error': true
				});
			});
		}

	// ミスタイプ時
	} else {
		var nextIndex = dcon.nextIndex(undefined, correct), nextValue = dcon.that(nextIndex).value;
		// dcon.missed( nextIndex );

		// コンボ・キーボード更新
		statusBoxController.comboCount(correct);
		keyBoardController.missed( key ).painting( nextValue );

		tipController.show( notEntered ? nextValue : 'Miss!', viewLayer.getCursorPosition() );
	}

	// カーソルリセット
	cursorController.reset();

	isTypeCursorChange = false;
    // return false; // return falseするならこれやめる

    //TEST.push(BENCHMARK.stop())
	console.log(BENCHMARK.stop());

	return false;
}

//var TEST = [];

function onScreenMousedownInput() {
	if (gameState.isPlaying()) {
		typeLayer.moveCursorToPosition( dcon.mCursor( mirrorLayer.getCursorPosition() ) );
		typeLayer.clearSelection();
	}
}

function onScreenClickInput() {
	typeLayer.focus();
}
