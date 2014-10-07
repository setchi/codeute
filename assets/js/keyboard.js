/*!
 * Bez v1.0.10-g5ae0136
 * http://github.com/rdallasgray/bez
 * 
 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
 * 
 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 * 
 * Copyright 2011 Robert Dallas Gray. All rights reserved.
 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
*/jQuery.extend({bez:function(a){var b="bez_"+$.makeArray(arguments).join("_").replace(".","p");if(typeof jQuery.easing[b]!="function"){var c=function(a,b){var c=[null,null],d=[null,null],e=[null,null],f=function(f,g){return e[g]=3*a[g],d[g]=3*(b[g]-a[g])-e[g],c[g]=1-e[g]-d[g],f*(e[g]+f*(d[g]+f*c[g]))},g=function(a){return e[0]+a*(2*d[0]+3*c[0]*a)},h=function(a){var b=a,c=0,d;while(++c<14){d=f(b,0)-a;if(Math.abs(d)<.001)break;b-=d/g(b)}return b};return function(a){return f(h(a),1)}};jQuery.easing[b]=function(b,d,e,f,g){return f*c([a[0],a[1]],[a[2],a[3]])(d/g)+e}}return b}});




var KeyboardController = function () {
	this.kbd = document.getElementById('keyboard');
	this.str = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\n';
	this.keyEntity = [];
	this.keyCache = 0;
	this.charCache = '';
	this.shiftCache = false;

	this.isShift = false;

	this.hidden = $('#statusBox').hasClass('none');

	var that = this;
	$(this.kbd).find('[class^="_"]').each(function () {
		var thisClass = $(this).attr('class'),
			index = thisClass.split('_'),
			nativeElm = document.getElementsByClassName(thisClass)[0];

		that.keyEntity[that.str[index[1]-32]] = nativeElm;

		if (index[2] !== '') {
			that.keyEntity[that.str[index[2]-32]] = nativeElm;
		}
	});

	// エンター追加
	this.keyEntity['\n'] = document.getElementsByClassName('key_enter')[0];
}

KeyboardController.prototype = {
	setKeyboardShow: function (hidden) {
		this.hidden = hidden;

		if (this.hidden) {
			$('#statusBox').addClass('none');

		} else {
			$('#statusBox').removeClass('none');
		}

		$.post('/account/setting/set.json', {
			'data': {
				'keyboard': hidden
			}
		});
	},

	setShift: function (onShift) {

		if (this.shiftCache !== onShift) {
			this.shiftCache = onShift;

			if (onShift) {
				this.kbd.className = 'onShift';

			} else {
				this.kbd.className = '';
			}
		}
		return this;
	},

	painting: function (target) {

		if (target === this.charCache || this.hidden) {
			return this;

		} else {
			this.charCache = target;
		}

		var that = this.keyEntity[this.keyCache];

		// 消灯
		that.className = '';
		// 発光
		this.keyEntity[target].className = 'painted';

		// キャッシュ更新・シフト更新
		this.keyCache = target;
		this.isShift = this.isShiftChar( target );
		this.setShift( this.isShift );

		return this;
	},

	missed: (function () {
		var timer = [];

		return function (target) {
			var that = $(this.keyEntity[ target ]);

			if (timer[target]) {
				clearTimeout(timer[target]);
				timer[target] = 0;

			} else {
				that.addClass('missed');
			}

			timer[target] = setTimeout(function () {
				that.removeClass('missed');
				timer[target] = 0;
			}, 200);

			return this;
		}
	}()),

	isShiftChar: function (target) {
		return ~'!"#$%&\'()*+<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ_`{|}~'.indexOf(target);
	}
}





var StatusBoxController = function () {
	this.stbox = $('#statusBox');

	this.combo = 0;
	this.enteredIndex = [];
	this.maxCombo = 0;
	this.nokoriStrLen = 0;
	this.strLen = 0;
	this.stBar = document.getElementById('statusBar');


	this.easing = $.bez([0.02, -0.55, 0, 0.11]);
}

StatusBoxController.prototype = {

	setMode: function (mode) {
		// Dark系とWhite系で分けれるようにする
		if (mode === 'white') {
			this.stbox.addClass('white');

		} else {
			this.stbox.removeClass('white');
		}
	},

	setStrLen: function (strLen) {
		this.strLen = strLen;
	},

	comboCount: (function () {
		var timer = null;

		return function (correct, index) {

			// 同じ対象の重複カウント防止
			if (correct) {
				if (~this.enteredIndex.indexOf(index)) {
					return;

				} else {
					this.enteredIndex.push(index);
				}
			}

			var that = this, comboStatus = '';

			if (correct) {

				clearTimeout(timer);
				timer = setTimeout(function () {
					that.combo = 0;
				}, 4000);
				
				that.combo++;

				// maxCombo更新
				if (that.maxCombo < that.combo) {
					that.maxCombo = that.combo;
					comboStatus = 'MAX'
				}

				// 10以上になったらディスプレイに表示
				if (that.combo > 9) {
					// setTimeout(that.updateCombo, 10, that.stBar, that.combo, comboStatus, that);
					that.updateCombo(that.stBar, that.combo, comboStatus, that);
				}

			} else {
				that.combo = 0;
				that.updateHTML(that.stBar, '<div id="miss-flash">Miss!</div>');
			}
		}
	}()),

	updateCombo: function(bar, combo, comboStatus, that) {
	/*
		var combo = that.getCombo();

		if (Combo <= combo) {
	//*/
			var str = "";

			if (combo < 30) {
				str = '<div id="combo" class="D">' + combo + '<small> ' + comboStatus + ' Combo!</small></div>';

			} else if (combo < 50) {
				str = '<div id="combo" class="C">' + combo + '<small> ' + comboStatus + ' Combo!</small></div>';

			} else if (combo < 80) {
				str = '<div id="combo" class="B">' + combo + '<small> ' + comboStatus + ' Combo!</small></div>';

			} else if (combo < 100) {
				str = '<div id="combo" class="A">' + combo + '<small> ' + comboStatus + ' Combo!</small></div>';

			} else if (combo < 200) {
				str = '<div id="combo" class="S">' + combo + '<small> ' + comboStatus + ' Combo!!</small></div>';

			} else {
				str = '<div id="combo" class="SS">' + combo + '<small> ' + comboStatus + ' Combo!!!</small></div>';
			}

			that.updateHTML(bar, str);
			//*
			$(bar.lastChild).animate({
				marginTop: '-75px',
				opacity: 0
			}, 600, that.easing)
			//*/
	/*
		}
	//*/
	},
	
	getCombo: function () {
		return this.combo;
	},

	warning: function (msg) {
		str = '<div id="miss-flash" class="D" style="font-size: 28px;">' + msg + '</div>';

		this.updateHTML(this.stBar, str);
	},

	updateHTML: function (elm, str) {
		elm.removeChild(elm.lastChild);
		elm.insertAdjacentHTML('BeforeEnd', str);
	}
}

/*
function test_4 () {
  stBar = document.getElementById('statusBar');

	function updateHTML1(elm, str) {
		elm.removeChild(elm.childNodes[0]);
		elm.insertAdjacentHTML('BeforeEnd', str);
	}
	function updateHTML2(elm, str) {
		elm.removeChild(elm.lastChild);
		elm.insertAdjacentHTML('BeforeEnd', str);
	}

  var count = 500, str ='<div id="combo" class="SSbig">400000<small> Max Combo!!!</small></div>';

	var BENCH = new Timer();
  for (var i = 0; i < count; ++i) {
  	updateHTML1(stBar, str);
  }
  console.log(BENCH.stop())


	var BENCH = new Timer();
  for (var i = 0; i < count; i++) {
  	updateHTML2(stBar, str);
  }
  console.log(BENCH.stop())
}
//*/
/*

var interval = 500000;

var elm1 = document.getElementById('keyboard');
var elm2 = $('#keyboard');

var bench1 = new Timer();
for(var i = 0; i < interval; i++) {
	i%2 ? elm2.addClass('test') : elm2.removeClass('test');
}
console.log(bench1.stop());





var bench2 = new Timer();
for(var i = 0; i < interval; i++) {
	
	i%2 ? $(elm1).addClass('test') : $(elm1).removeClass('test');
}
console.log(bench2.stop());




var convert = function (str) {
	console.log('a')
	var res = str.replace(/\_([0-9]{2, 3})\_([0-9]{2, 3})/gim, function (j, a, b) {
		console.log(j, a, b)
		return '_' + (+a-32) + '_' + (+b-32);
	})

	return res;
}

var convert = function (str) {
	return str.replace(/(a)(b)/g, function (a, b, c) {
		console.log(a, b, c)
	})
}
// */