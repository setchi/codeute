// ヒートマップ用の色を求める
function getColorFromDiff(diff, upperRange, lowerRange) {

	if (diff >= 0) {
		diff /= lowerRange;

		if (diff > 255) diff = 255;
		diff = 255 - diff | 0;

		return ['' + diff + ', 255, 0', 0.9];
		// return ['' + diff + ', 255, 0', ((255 - diff) / 255) +0.4];
	}

	if (diff < 0) {
		diff /= -upperRange;

		if (diff > 255) diff = 255;
		diff = 255 - diff | 0;

		return ['255, ' + diff + ', 0', 0.9];
		// return ['255, ' + diff + ', 0', ((255 - diff) / 255) +0.4];
	}
}

function drawResult(dcon, record, rankStates) {
	var speedMax = record.result.speedMax,
		speedAvg = record.result.speedAvg,
		heatMapElement = $('#result-heatmap'),
		typingLayer = $('#typing'),
		resultText = getResultText(record, rankStates);

	twitterAPI(codeId, resultText.twitter);

	if (speedMax > speedAvg * 10) {
		speedMax = speedAvg * 10;
	}

	try {
		drawHeatMap(dcon, heatMapElement, record.captureMap, speedAvg);
		drawChart(
			record.captureMiss,
			record.captureString,
			record.captureTimeArr,
			record.captureSpeedPerMinArr,
			record.speedPerMinMax,
			speedAvg,
			record.comboArr,
			record.result.comboAvg,
			record.result.comboMax,
			heatMapElement,
			resultText.title,
			resultText.hosei
		);
//*
	} catch(e) {
		console.warn(e);
	}
//*/
	typingLayer.find('>div').hide();
	typingLayer.find('#resultLayer').show(0);
}


function getResultText(record, rankStates) {
	var titleHtml = '',
		tweetText = '',
		rankStatesHtml = '',
		chartHeightHosei = 0;

	titleHtml += '<h2 class="audiowide total-score">Score => <span>' + record.result.totalScore + '</span></h2>';

	if (rankStates.Error) {

	} else if (rankStates.rank !== false) {

		record.result.rank = rankStates.rank;
		chartHeightHosei = 70;

		rankStatesHtml += '<div class="alert alert-success" id="result-rankstate">';
		rankStatesHtml +=   '<button class="close" data-dismiss="alert">&times;</button>';
		rankStatesHtml +=   '<strong>自己ベスト更新！</strong>&nbsp;';
		rankStatesHtml +=   '<div class="btn" id="rankingRegistBtn">ランキングに登録する(' + record.result.rank + '位)</div>';
		rankStatesHtml += '</div>';

		tweetText = '' + record.result.rank + '位にランクインしました！ ';
	}

	tweetText += 'Score => ' + record.result.totalScore + ' ';
	tweetText += '速度' + record.result.speedPerSec + '打/秒 ';
	tweetText += 'ミス' + record.result.missRate + '% ';
	tweetText = tweetText + 'コーデュート！{β}';
	// タイトルはOGPで出るから消す
	// tweetText = tweetText + record.tweetTitle;

	titleHtml += rankStatesHtml; // ランキングアラート挿入
	// $('#result-rank').html(rankStatesHtml);
	titleHtml += '<h4 class="audiowide"><small>';
	titleHtml += 'WPM: <span class="value">' + record.result.WPM + '</span>&nbsp;<span class="vertical">/</span>&nbsp;';
	titleHtml += 'タイプ速度: <span class="value">' + record.result.speedPerSec + '/sec</span>&nbsp;<span class="vertical">/</span>&nbsp;';
	titleHtml += 'タイプミス: <span class="value">' + record.result.missRate + '%</span>&nbsp;<span class="vertical">/</span>&nbsp;';
	titleHtml += '最大コンボ: <span class="value">' + record.result.comboMax + '</span>&nbsp;<span class="vertical">/</span>&nbsp;';
	titleHtml += '時間: <span class="value">' + record.result.totalTime + '</span>';
	titleHtml += '</small></h4>';

	return {
		title: titleHtml,
		hosei: chartHeightHosei,
		twitter: tweetText
	}
}


function drawHeatMap(dcon, renderTo, captureMap, speedAvg) {
	var speedMax = 0, res = '', elm;

	// 平均・MAXを求める
	for (var i in captureMap) {
		if (speedMax < captureMap[i].speed) {
			speedMax = captureMap[i].speed;
		}
		// speedSum += captureMap[i].speed;
	}

	// speedAvg = Math.pow(speedSum, 1/captureMap.length); // 相乗平均
	// speedAvg = speedSum/captureMap.length; // 相加平均

	if (speedMax > speedAvg * 4.5) {
		speedMax = speedAvg * 4.5;
	}


	// HTMLを生成するための準備
	var upperRange = (speedMax - speedAvg) / 255, lowerRange = speedAvg / 255,
		viewLayer = $('#viewLayer').find('.ace_text-layer').find('.ace_line'),
		fontSize = viewLayer.css('font-size'), lineHeight = parseInt(viewLayer.css('height'))-2;

	var gutterCount = 1;

	var style = '<style>#codeHeatMap tr, #codeHeatMap td, #codeHeatMap span { font-size: 16px;line-height: ' + 17 + 'px; height: ' + 17 + 'px;}</style>';
	$(style).appendTo('head');

	res = '<div id="codeHeatMap"><table>';
	// res += '<thead><tr><td colspan="2" class="audiowide"></td></tr></thead>';
	res += '<tfoot><tr><td colspan="2" class=""></td></tr></tfoot>';
	res += '<tbody><tr><td class="gutter">' + gutterCount++ + '</td><td>';

	// length-1にすると正常に終了しない
	for (var i = 0, len = dcon.data.length-1; i < len; i++) {
		elm = dcon.data[i];

		if (i in captureMap) {
			var color = getColorFromDiff( speedAvg - captureMap[i].speed, upperRange, lowerRange ),
				missed = captureMap[i]['missed'] ? 'missed' : '',
				fontSize = escapeHTML(elm.value).match(/ /) ? ' font-size: 10px;' : '';

			if (elm.value === '\n') {
				res += '<span style="color: rgba(' + color[0] + ', ' + 0.6*color[1] + ');font-size: 14px;" data-index="' + captureMap[i].index + '" class="'+missed+'">&crarr;</span></td></tr><tr><td class="gutter">' + gutterCount++ + '</td><td>';

			} else {
				var text = escapeHTML(elm.value),
					fontColor = 'rgba(' + color[0] + ', ' + (text.match(/ |\t/) ? 0.6*color[1] : color[1])  + ')';

				res += '<span style="color: '+fontColor+';' + fontSize + '" data-index="' + captureMap[i].index + '" class="'+missed+'">' + text.replace(/ /g, '&#9251;').replace(/\t/g, '&#9251;&#9251;&#9251;&#9251;') + '</span>';
			}

		} else {

			if (elm.value === '\n') {
				res += '</td></tr><tr><td class="gutter">' + gutterCount++ + '</td><td>';

			} else {
				res += escapeHTML(elm.value).replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
			}
		}
	}

	res += '</td></tr>';
	res += '<tbody>';
	res += '</table></div>';

	renderTo.html(res);
	return res;
}


function drawChart(miss, chars, speed, speedPerMin, speedPerMinMax, speedAvg, combo, comboAvg, comboMax, heatMapElement, title, heightCorrection) {
	// Highchart全体設定
	/*
    Highcharts.setOptions({
		global: {  // グローバルオプション
			useUTC: false   // GMTではなくJSTを使う
		},
		lang: {  // 言語設定
			rangeSelectorZoom: '表示範囲',
			resetZoom: '表示期間をリセット',
			resetZoomTitle: '表示期間をリセット',
			rangeSelectorFrom: '表示期間',
			rangeSelectorTo: '～',
			printButtonTitle: 'チャートを印刷',
			exportButtonTitle: '画像としてダウンロード',
			downloadJPEG: 'JPEG画像でダウンロード',
			downloadPDF: 'PDF文書でダウンロード',
			downloadPNG: 'PNG画像でダウンロード',
			downloadSVG: 'SVG形式でダウンロード',
			months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			weekdays: ['日', '月', '火', '水', '木', '金', '土'],
			numericSymbols: null   // 1000を1kと表示しない
		}
	});*/

	var chart = new Highcharts.StockChart({ // 以下、chartオブジェクトに渡す引数
		chart: {
			renderTo: 'result-chart', // どの要素にグラフを描画するかを指定
			// type: 'line', // グラフの種類を指定
			borderRadius: 0,
			marginTop: 155 + heightCorrection,
			height: 345 + heightCorrection
		},
		title: {
			text: title,
			margin: 5,
			useHTML: true
		},
		/*
		subtitle: {
			text: '緑：コンボ | 黄: ペース(打/分) | 赤： 入力時間(秒)'
		},
		*/
		xAxis: { // x軸の値を指定
			labels: {
				enabled: false
			}
		},

		yAxis: [{
            min: 0,
            max: comboMax,
			title: {
				text: 'コンボ' // y軸の軸名を指定
			},
			opposite: true, // グラフの右側に表示
            //y軸の表記設定
            labels: {
	            formatter: function() {
	　　　　	        return (this.value);
	　　　　	    }
            },
			plotLines: [{
				value: comboAvg,
				//* 緑の方
				color: "#55BF3B",
				//*/

				/* 灰色の方
				color: "#7798BF",
				//*/
				dashStyle : 'dash',
				width: 1
			}]
		}//*
		,{
            min: 0,
			title: {
				text: '入力時間 ( 秒 )' // y軸の軸名を指定
			},
            //y軸の表記設定
            labels: {
	            formatter: function() {
	　　　　	        return (this.value + " 秒");
	　　　　	    }
            },
			plotLines: [{
				value: speedAvg,
				//*
				color: "#DF5353",
				//*/
				dashStyle : 'dash',
				width: 1
			}]
		}//*/
		,{
			min: speedPerMinMax[1],
			max: speedPerMinMax[0]*1.3,
			title: {
				// y軸の軸名を指定
				text: 'ペース ( 打 / 分 )'
			},
            labels: {
	            formatter: function() {
	　　　　	        return '';
	　　　　	    }
            }
		}//*/
		],

		tooltip: { // マウスオーバーした際に表示する文書を指定
			formatter: function () {
				//*
				heatMapElement.find('.highlight').removeClass('highlight').end().find('[data-index="' + this.points[0].x + '"]').addClass('highlight');

				var tip = '<span style="font-size: 18px; padding: 3px;">" ' + chars[this.points[0].x] + ' "</span><br>',
					fixedNum = {
						'入力時間': 3,
						'ペース': 1,
						'コンボ': 0
					}

				if (miss[this.points[0].x]) {
					tip += '<span style="color:#ff0066">ミス</span>: <b>' + miss[this.points[0].x] + '</b><br/>';
				}
				if (this.points[0]) {
					tip += '<span style="color:' + this.points[0].series.color + '">' + this.points[0].series.name + '</span>: <b>' + (this.points[0].y).toFixed(fixedNum[this.points[0].series.name]) + '</b><br/>';
				}
				if (this.points[2]) {
					tip += '<span style="color:' + this.points[2].series.color + '">' + this.points[2].series.name + '</span>: <b>' + (Math.round(this.points[2].y * 10) / 10).toFixed(fixedNum[this.points[2].series.name]) + ' 打/分</b><br/>';
				}
				if (this.points[1]) {
					tip += '<span style="color:' + this.points[1].series.color + '">' + this.points[1].series.name + '</span>: <b>' + (Math.round(this.points[1].y * 100 * 10) / 1000).toFixed(fixedNum[this.points[1].series.name]) + ' 秒</b><br/>';
				}
				return tip;
			}
		},
		series: [
			{ // データ系列を指定
				type: 'area',
				name: 'コンボ',
				data: combo,
				fillColor : {
					linearGradient : [0, 0, 0, 300],
					stops : [
						[0, Highcharts.getOptions().colors[0]],
						[1, 'rgba(2,0,0,0)']
					]
				}
			}//*
			, {
				type: 'line',
				name: '入力時間',
				data: speed,
				// step: true,
				yAxis: 1
			}//*/
			, {
				type: 'line',
				name: 'ペース',
				id: 'speed',
				data: speedPerMin,
				yAxis: 2
				// step: true,
			}
			, {
				type : 'flags',
				name: 'トップスピード',
				data : [{
					x : speedPerMinMax[2],
					title : '<small><span style="font-style: italic">'+(speedPerMinMax[0]).toFixed(1)+'</span> \u6253/\u5206</small>',

					text : 'トップスピード'
				}],
				color : '#fff',
				fillColor : '#fff',
				style : {// text style
					color : '#000'
				},
				states : {
					hover : {
						fillColor : '#fff' // darker
					}
				},
				useHTML: true,
				onSeries : 'speed',
				// shape : 'squarepin'
				shape : 'squarepin'
				// y: -10
			}
		],

        loading: {
        	showDuration: 1000
        },

        plotOptions: {
        	column: {
        		pointWidth: 3
        	},

        	line: {
        		lineWidth: 1,
        		
	            states: {
	                hover: {
	                    enabled: true,
	                    lineWidth: 1
	                }
	            }
        	},

        	area: {
        		lineWidth: 2
        	}
        },

        //* グラフの表示を切り替える
        legend: {
        	enabled: true,
        	align: 'center',
        	layout: 'horizontal',
        	verticalAlign: 'middle',
        	borderWidth: 0,
        	y: -38 + heightCorrection/2
        },
        //*/

		rangeSelector: { enabled: false }, // 表示幅選択ボタン
		navigator: {
			enabled : true,
			baseSeries: 2,
			height: 30,
			series: {
				type: 'line'
			},
			xAxis: {
				labels: {
					enabled: false
				}
			}
		}, // 下のナビゲーター
		scrollbar: { enabled : true }, // スクロールバー
		credits: { enabled: false } // クレジット
	});
}
