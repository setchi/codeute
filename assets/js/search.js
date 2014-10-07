$(function () {
	var rootpath = '/codeute/';
	var rootpath = '/';

	var limit = 16, $result = document.getElementById('result');

	 var generateElement = function (array) {
		var element = document.createElement(array[0]);

		for (var key in array[1]) {
			element.setAttribute(key, array[1][key]);
		}

		if (array[2] instanceof Array) {

			if (array[2][0] instanceof Array) {

				for (var i = 0; i < array[2].length; ++i) {

					if (array[2][i] instanceof Array) {
						element.appendChild(arguments.callee(array[2][i]));
					}
				}

			} else {
				element.appendChild(arguments.callee(array[2]));
			}

		} else if (typeof array[2] === 'string') {
			element.insertAdjacentHTML('BeforeEnd', array[2]);
		}

		return element;
	}
		
	function setCode(elm) {
		var idList = [], infoList = {};
		var editor = {};
		var timerCnt = 0;


		$(elm).each(function () {
			var that = $(this),
				theme = that.data('theme'),
				id = that.data('code');

			idList.push(id);

			infoList[id] = {
				'elm': this,
				'mode': id.split('/')[0],
				'theme': theme
			}

		});

		if (idList.length < limit) {
			end = true;
		}

		for (var id in infoList) {
			setTimeout(function (editor, info) {
				editor = ace.edit(info['elm']); // 結構時間食ってる
				editor.session.setUseWorker(false);
				editor.setReadOnly(true);
				editor.setShowFoldWidgets(false); // 折り畳みを無効
				editor.setDisplayIndentGuides(false); // インデントガイドを非表示
				editor.setShowPrintMargin(false); // PringMarginを非表示
				editor.session.on('changeMode', function () {
					$(info['elm']).removeClass('code-loading');
				});
				editor.session.setMode("ace/mode/" + info['mode']);
				editor.setTheme("ace/theme/" + info['theme']);

				editor.moveCursorTo(0, 0); // ほぼ0ms

			}, timerCnt++ * 70, editor[id], infoList[id]);
		}
	}

	function getState() {
		return sorting + lang;
	}

	function ajaxGetCode(query, page, lang, sorting, init) {
		getting = true;

		if (!init) {
			$result.appendChild(loadingElement);
		}

		$.get(rootpath + 'search.json', {
			'q': query,
			'p': page,
			's': sorting,
			'lang': lang,
			'ajax': true

		}, function (d) {

			if (d.state !== getState()) {
				return;
			}

			$($result).find('.ajax_loading').remove();

			// 中身が空でなかったら実行
			if (d.html[2].length) {
				var timer = new Timer();
				var resultHTML = generateElement(d.html);

				$result.appendChild(resultHTML);
				setCode($result.getElementsByClassName('code-loading'));

				console.log(timer.stop());

				getting = false;
				end = d.end;
			}

		}, 'json');
	}

	var $sorting = $('.select-sorting'), $lang = $('.select-lang');
	var query = $('#query').text(), page = 0, sorting = $sorting.val(), lang = $lang.val();
	var getting = false, end = false,
	
	loadingElement = generateElement(['li', {'class': 'ajax_loading'}, 
		['div', {'class': 'ajax_loading_inner'},
			[
				['div', {'id': 'block_1', 'class': 'barlittle'}],
				['div', {'id': 'block_2', 'class': 'barlittle'}],
				['div', {'id': 'block_3', 'class': 'barlittle'}],
				['div', {'id': 'block_4', 'class': 'barlittle'}],
				['div', {'id': 'block_5', 'class': 'barlittle'}]
			]
		]
	]);

	// ページが開かれた時のコード取得処理
	ajaxGetCode(query, page, lang, sorting, true);

	var controlBox = false, controlBoxViewMargin = $('.well').find('.select-lang').offset().top - 35;
	console.log(controlBoxViewMargin)
	$(window).bind("scroll", function() {
		var scrollTop = $(this).scrollTop();

		if (scrollTop > controlBoxViewMargin) {

			if (!controlBox) {
				controlBox = true;
				$('.control-box').addClass('on');
			}

		} else if (controlBox) {
			controlBox = false;
			$('.control-box').removeClass('on');
		}

		// 下10%の位置にスクロールしたら続きを自動取得
		if (!getting && !end) {
			scrollHeight = $(document).height();
			scrollPosition = $(this).height() + scrollTop;

			if ( (scrollHeight - scrollPosition) / scrollHeight <= 0.15) {
				page++;
				ajaxGetCode(query, page, lang, sorting, false);

			} else {
				//それ以外のスクロールの位置の場合
			}
		}
	});

	// 言語指定
	$lang.change(function () {
		page = 0;
		lang = $(this).val();
		$result.innerHTML = '';
		ajaxGetCode(query, page, lang, sorting, false);
		$lang.val(lang);
	});

	// 並べ替え
	$sorting.change(function () {
		page = 0;
		sorting = $(this).val();
		$result.innerHTML = '';
		ajaxGetCode(query, page, lang, sorting, false);
		$sorting.val(sorting);
	});
});
