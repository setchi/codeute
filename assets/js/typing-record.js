var GameRecord = function () {
	// 成績関連
	this.totalTime = 0;
	this.captureTime = null;
	this.captureTimeArr = [];
	this.captureString = [];
	this.comboArr = [];
	this.captureMiss = [];
	this.captureSpeedPerMinArr = [];
	this.captureSpeedPerMinMax = [];
	this.captureTypeChars = {
		'correct': {},
		'incorrect': {}
	};
	// this.keywordTimeMap = [];

	this.result = {
		totalTime: null,
		speedPerSec: 0,
		missRate: 0,
		comboMax: 0,
		rank: 0,
		speedMax: 0,
		speedAvg: 0,
		totalScore: 0,
		WPM: 0,
		EPM: 0
	}

	this.convertCharList = [];
	this.convertCharList[' '] = '\u2423';
	this.convertCharList['\n'] = '\u21b5';

	this.captureMap = [];
	this.captureCount = 0;
}

GameRecord.prototype = {
	capture: function () {
		var beforeCorrect = true;

		return function (index, correct, key) {

			if (this.captureTime === null) {		
				this.totalTime = Timer();
				this.captureTime = Timer();
				return 0;
			}

			if (correct) {
				this.captureTypeChars['correct'][key] = 1 + (this.captureTypeChars['correct'][key] || 0);

				if (key === ' ' || key === '\n') {
					key = this.convertCharList[key];
				}

				var capture = this.captureTime.capture();

				this.captureTimeArr.push(capture/1000);
				this.captureString.push(key);
				this.comboArr.push(statusBoxController.combo);
				// this.keywordTimeMap.push([index, capture]);

				// ヒートマップ生成用
				this.captureMap[index] = {
					index: this.captureCount++,
					speed: capture/1000,
					missed: !beforeCorrect
				}

			} else {
				this.captureMiss[this.captureTimeArr.length] = 1 + (this.captureMiss[this.captureTimeArr.length-1] || 0);
				
				// 連続ミス時はカウントしない
				if (!beforeCorrect) {
					key = dcon.data[index]['value'];
					this.captureTypeChars['incorrect'][key] = 1 + (this.captureTypeChars['incorrect'][key] || 0);
				}
			}

			beforeCorrect = correct;

			return capture;
		}
	}(),

	stopCapture: function () {
		this.totalTime = this.totalTime.stop();
	},

	calculating: function (dcon) {

		/* ワードランキング用のマッピング
		for (var i in this.keywordTimeMap) {
			dcon.timeMapping(this.keywordTimeMap[i][0], this.keywordTimeMap[i][1])
		}
		//*/
		var speedAvg = 0, speedSum = 0, speedMax = 0, comboAvg = 0, comboSum = 0, speedPerSec = 0, missRate = 0, timeStr = '', speedPerMinMax = [0, 0];
		var centerIndexArr = [];

		// コンボとTimeの最大値・平均値を求める
		for (var i = 0, len = this.captureTimeArr.length; i < len; i++) {
			speedSum += this.captureTimeArr[i][1];
			comboSum += this.comboArr[i];

			if (this.result.comboMax < this.comboArr[i]) {
				this.result.comboMax = this.comboArr[i];
			}

			if(speedMax < this.captureTimeArr[i][1]) {
				speedMax = this.captureTimeArr[i][1];
			}

			var speedPerMin = getMinPerSpeedFromArr(this.captureTimeArr, i, len);
			this.captureSpeedPerMinArr.push( speedPerMin );

			if (speedPerMinMax[0] < speedPerMin) {
				speedPerMinMax[0] = speedPerMin;
				speedPerMinMax[2] = i;
			}

			if (speedPerMinMax[1] > speedPerMin) {
				speedPerMinMax[1] = speedPerMin;
				speedPerMinMax[3] = i;
			}
		}

		this.speedPerMinMax = speedPerMinMax;

		for (var i in this.captureMap) {
			centerIndexArr.push(this.captureMap[i]);
		}

		// 該当区間の平均を求める
		function getMinPerSpeedFromArr(arr, len, max) {
			var totalTime = 1, diff = 0, padding = max/10|0, margin = padding ? padding%2 ? padding+1 : padding : 2;

			if (margin > 25) {
				margin = 26;
			}
			var start = len - margin/2, stop = len + margin/2;

			if (0 > start) {
				start = 0;
			}

			if (arr.length-1 < stop) {
				stop = arr.length-1;
			}

			diff = stop - start;

			for(var i = start; i < stop; i++) {
				totalTime *= arr[i];
			}

			return 60 / Math.pow(totalTime, 1/diff);
		}

		// とりあえず遅い順にソート
		centerIndexArr.sort(function(a,b){
			a = a.speed;
			b = b.speed;
			if( a < b ) return 1;
			if( a > b ) return -1;
			return 0;
		});

		// 中央値を求める
		var centerIndex = centerIndexArr.length;

		if (centerIndex % 2) {
			centerIndex = centerIndex / 2 | 0;
			centerValue = centerIndexArr[centerIndex].speed;

		} else {
			centerIndex /= 2;

			if (!centerIndexArr[centerIndex+1]) {
				centerValue = (centerIndexArr[centerIndex].speed + centerIndexArr[centerIndex+1].speed) / 2;

			} else {
				centerValue = centerIndexArr[centerIndex].speed;
			}
		}

		// speedAvg = Math.pow(speedSum, 1/len);
		// speedAvg = speedSum/len;
		// comboAvg = Math.pow(comboSum, 1/len);
		speedAvg = centerValue;
		comboAvg = comboSum/len;

		// Speed/sec, missRateを求める
		var totalMiss = 0;
		for (var i in this.captureMiss) {
			totalMiss += this.captureMiss[i] || 0;
		}
		this.totalTime /= 1000;
		this.result.speedPerSec = Math.round(len/this.totalTime * 100) / 100;
		this.result.missRate = Math.round(totalMiss / len * 100 * 10) / 10;
		this.result.totalTime = getStatusTimeFromSec(this.totalTime);
		this.result.speedMax = speedMax;
		this.result.speedAvg = speedAvg;

		// トータルスコア計算
		var WPM = 0, EPM = 0, HOSEI = 75;
		WPM = this.result.speedPerSec*60 / 5;
		EPM = (this.captureMiss.join('').length / this.totalTime) * 60;
		this.result.totalScore = (WPM - EPM) * HOSEI | 0;
		this.result.WPM = Math.round(WPM);
		this.result.EPM = Math.round(EPM);
	},

	getRecord: function () {
		var result = this.result;

		return {
			'total_score': result.totalScore,
			'total_time': result.totalTime,
			'type_speed': result.speedPerSec,
			'miss_rate': result.missRate,
			'max_combo': result.comboMax,
			'type_chars': JSON.stringify(this.captureTypeChars),
			'wpm': result.WPM,
			'epm': result.EPM,
			'line_num': viewLayer.session.getLength()
		}
	}
}


// 秒数から、hh:mm:ss:ccを求める
function getStatusTimeFromSec(totalTimeCache) {
	var timeStr = '', h = 0, m = 0, s = 0, c = 0;

	function zeroFormat(time) {

		if (time < 10) {
			return '0' + time;
		
		} else {
			return '' + time;
		}
	}

	// 時間取得
	if (totalTimeCache >= 60 * 60) {
		h = totalTimeCache / 60 * 60 | 0;
		totalTimeCache %= 60 * 60;
	}

	if (totalTimeCache >= 60) {
		m = totalTimeCache / 60 | 0;
		totalTimeCache %= 60;
	}

	if (totalTimeCache >= 1) {
		s = totalTimeCache | 0;
		totalTimeCache -= s;
	}

	c = totalTimeCache * 100 | 0;

	return zeroFormat(h) + ':'+ zeroFormat(m) + ':' + zeroFormat(s) + ':' + zeroFormat(c);
	// return (h ? zeroFormat(h) + ':' : '') + zeroFormat(m) + ':' + zeroFormat(s) + ':' + zeroFormat(c);

}
