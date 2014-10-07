// tokensにインデックスを振る
onmessage = function (event) {
	
	postMessage({
		'type': 'process',
		'msg': 0
	});

	var acceptData = JSON.parse(event.data);

	var lines = acceptData[0], nonPassList = acceptData[1],  debug = acceptData[2];

	var tokens        = [],
		openPareStack = [],
		analysis      = {},
		dataObject    = {},
		type    = '',
		value   = '',
		tokenCnt          = 0,
		prevOpenPairIndex = 0;

	var getIndex = (function () {
		var idxStack = [],
			idxCnt   =  0,
			inDoubleString = false,
			inSingleString = false,
			dQuoteFlg = false,
			sQuoteFlg = false;

		return function (str, i, tokenCnt, type) {
		    var idx      = tokenCnt,
		    	openFlg  = false, 
		    	closeFlg = false;

		    // 開き括弧のとき
		    if ( type.match('lparen') ) {
		    	openFlg = true;
		    	idxStack.push(idx);

			// 閉じ括弧のとき
			} else if ( type.match('rparen') ) {
				closeFlg = true;
				idx = idxStack.pop();

			// 文字列のとき
			} else if ( type.match('string') ) {

				// ダブルクォートで囲まれているとき
			    if ( !inSingleString && str[i] === '"' ) {

			    	// start
			    	if ( dQuoteFlg = !dQuoteFlg ) {
			    		inDoubleString = true;
						openFlg        = true;
						type           = 'lparen';
						idxStack.push(idx);

			    	// end
			    	} else {
			    		inDoubleString = false;
			    		closeFlg       = true;
			    		type           = 'rparen';
			    		idx            = idxStack.pop();
			    	}

				// シングルクォートで囲まれているとき
			    } else if ( !inDoubleString && str[i] === "'" ) {

			    	// start
			    	if ( sQuoteFlg = !sQuoteFlg ) {
			    		inSingleString = true;
						openFlg        = true;
						type           = 'lparen';
						idxStack.push(idx);

			    	// end
			    	} else {
			    		inSingleString = false;
			    		closeFlg       = true;
			    		type           = 'rparen';
			    		idx            = idxStack.pop();
			    	}
			    }
		    }

		    return {
		    	isClose: closeFlg,
		    	isOpen : openFlg,
		    	index  : idx,
		    	type   : type
		    };
		}
	})();

	/*
		空白文字の前後の文字が両方とも英数字だった場合、省略できない空白である
	*/
	function getPrevChar(token, j, k) {
		
		// 空白以外の文字を探す
		// kがゼロになった場合はjを--
		// jがゼロの場合は j0 k0の値を返す
		// 
		var res = '', finish = false;

		while (j || k) {

			if (token[j].value[k] !== ' ') {
				res = token[j].value[k];
				break;
			}

			if (k === 0) {
				j--;
				k = token[j].value.length-1;

			} else {
				k--;
			}
		}

		return res || ' ';
	}

	function getNextChar(token, j, k) {

		// 空白以外の文字を探す
		// kがtoken.length-1になった場合はjを++
		// jがtoken.length-1の場合は 最後の文字を返す

		var res = '', finish = false, klen = token[j].value.length;

		while (j < token.length-1 || k < klen) {

			if (token[j].value[k] !== ' ') {
				res = token[j].value[k];
				break;
			}

			if (k < klen && j < token.length-1) {
				j++;
				k = 0;
				klen = token[j].value.length;

			} else {
				k++;
			}
		}

		return res || ' ';
	}

	// typeを生成 token, インデックス, None:省略可 List:省略不可
	function typeCheck(token, j, k) {
		var res       = token[j].type,
			value     = token[j].value[k];

		// 文字列じゃなかったとき
		if ( !res.match('string') ) {
			var prev = token[j && j-1];

			// コメントアウトだったらインデント扱いにする
			if ( token[j].type.match('comment') ) {
				res = 'indent';

			// その他のホワイトスペース
			} else if ( token[j].value.match(/^\s+$/) || value === ' ' ) {

				// console.log('prev: ' + getPrevChar(token, j, k), 'current: ' + token[j].value[k], 'next: ' + getNextChar(token, j, k));
				
				var prevChar = getPrevChar(token, j, k),
					nextChar = getNextChar(token, j, k),
					prevRe   = /[a-zA-Z0-9_]/,
					nextRe   = /[a-zA-Z0-9_]/;

				if (nonPassList) {
					prevRe = nonPassList.prev;
					nextRe = nonPassList.next;
				}

				if (prevChar.match(prevRe) && nextChar.match(nextRe)) {
					res = 'required.space';

				} else {
					res = 'indent';
				}

			// 開き括弧
			} else if ( token[j].value[k].match(/\[|\(|\{/) ) {
				res = 'lparen';

			// 閉じ括弧
			} else if ( token[j].value[k].match(/\]|\)|\}/) ) {
				res = 'rparen';

			}

		}

		return res;
	}

	function isOptionalChar(elm) {
		var type = elm.type;
		return type === 'indent' || type === 'enter' || type === 'comment' || ( !type.match('string') && elm.value === ' ' ) || type === 'support.php_tag';
	}

	function createKeywordMap(tokens) {
		var keywordMap = {},
			idxCache   = 0,
			str = '', idxArr = [], missedArr = [];

		for (var i = 0, len = tokens.length-1; i < len;) {
			str = '', idxArr = [], missedArr = [];

			// インデックスが同じ間処理する
			while ( i < len && idxCache === tokens[i].index ) {

				// 有効文字の場合 required.spaceやenterも入れる
				if ( !isOptionalChar( tokens[i] ) || tokens[i].type === 'required.space' || tokens[i].type === 'enter' ) {
					str += tokens[i].value;
					idxArr.push(i);
					missedArr.push(0);
				}

				i++;
			}

			// 有効文字が存在していた場合、ひとつのキーワードとみなして処理していく
			if ( str !== '' ) {

				var idx = tokens[i && i-1].index;

				// 既に存在している場合はつなげて表示する
				if ( idx in keywordMap ) {
					keywordMap[ idx ].key += str;

					 // 配列もつなぎ合わせる
					keywordMap[ idx ].dataIdxArr = keywordMap[ idx ].dataIdxArr.concat(idxArr);
					keywordMap[ idx ].missedMap = keywordMap[ idx ].missedMap.concat(missedArr);
					keywordMap[ idx ].speedMap = keywordMap[ idx ].speedMap.concat(missedArr);

				// 存在しない場合は要素を生成する。
				} else {
					keywordMap[ idx ] = {
						key: str,
						missed: 0,
						missedMap: missedArr.slice(0),
						speedMap: missedArr.slice(0),
						dataIdxArr: idxArr.slice(0)
					}
				}
			}

			idxCache = tokens[i].index;
		}

		return keywordMap;
	}

	var data     = [],
		arrInput = [],
		pushData = {},
		colNum   = 0,
		processCache = 0,
		processCounter = 0,
		idxMap = {},
		startup = "",
		enteredNum = 0;

	try {
		// 行ごと
		for (var i = 0, len = lines.length-1; i < len; i++) {
			colNum     = 0;

			// トークンごと
			for (var j = 0, jlen = lines[i].length; j < jlen; j++, tokenCnt++) {

				value = lines[i][j].value;

				// console.log
				debug && postMessage({
					'type': 'log',
					'msg': '●: ' +  value + '[ ' + lines[i][j].type + ' ]'
				});

				// 文字ごと
				for (var k = 0, klen = value.length; k < klen; k++) {

					type     = typeCheck(lines[i], j, k);
					analysis = getIndex(value, k, tokenCnt, type);

					prevOpenPairIndex = 0;

					// 解析処理
					if ( analysis.isOpen ) {
						openPareStack.push(tokens.length)

					} else if ( analysis.isClose ) {
						prevOpenPairIndex = openPareStack.pop();
						
						if (tokens[prevOpenPairIndex]) {
							tokens[prevOpenPairIndex].rpair = tokens.length;
						
						} else {
							tokens[prevOpenPairIndex] = 0;
						}
					}

					// console.log
					debug && postMessage({
						'type': 'log',
						'msg': '○: ' + lines[i][j].value[k] + '[ ' + analysis.type + ' ]'
					});
					
					pushData = {
						row  : i,
						col  : colNum++,
						type : analysis.type,
						value: value[k],
						index: analysis.index,
						rpair: 0,
						fpair: prevOpenPairIndex,
						entered  : false
						//overwrite: false
					};


					var t = pushData.type;

					idxMap[ [pushData.row, pushData.col] ] = { idx: tokens.length, rowEnt: false };

					if ( t === 'indent'　|| type === 'support.php_tag') {
						startup += pushData.value;
						arrInput.push(tokens.length);

					} else {
						startup += ' ';
					}

					if ( t === 'indent' || t === 'comment' || ( t !== 'required.space' && !t.match('string') && pushData.value === ' ' ) || type === 'support.php_tag') {
						enteredNum++;
					}

					tokens.push(pushData);
				}
			}

			pushData = {
				row  : i,
				col  : colNum,
				type : 'enter',
				value: '\n',
				index: tokenCnt,
				rpair: 0,
				fpair: 0,
				entered  : false
				//overwrite: false
			};

			// ラスト以外push
			if ( i < len ) {
				enteredNum++;
				idxMap[ [pushData.row, pushData.col] ] = { idx: tokens.length, rowEnt: false };

				tokens.push(pushData);
			}

			if ( i < len - 1 ) {
				startup += '\n';
			}

			// 進捗状況出力
			if ( len / 20 < i - processCache ) {
				processCache = i;
				processCounter++;
				postMessage({
					'type': 'process',
					'msg': processCounter*5
				});
			}
		}

		postMessage({
			'type': 'process',
			'msg': 100
		});
		
		postMessage({
			'type': 'finish',
			'msg': JSON.stringify([ tokens, startup, enteredNum, idxMap, createKeywordMap( tokens ), arrInput ])
		});

	} catch (e) {
		postMessage({
			'type': 'error',
			'msg': e + ''
		});
		
		postMessage({
			'type': 'finish',
			'msg': JSON.stringify([ tokens, startup, enteredNum, idxMap, createKeywordMap( tokens ), arrInput ])
		});
	}
}
