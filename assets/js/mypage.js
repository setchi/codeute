$(function () {
	 var generateElement = function (array) {
		var element = document.createElement(array[0]);

		for(var key in array[1]) {
			element.setAttribute(key, array[1][key]);
		}

		if(array[2] instanceof Array) {

			if(array[2][0] instanceof Array) {

				for(var i = 0; i < array[2].length; ++i) {

					if(array[2][i] instanceof Array) {
						element.appendChild(arguments.callee(array[2][i]));
					}
				}

			} else {
				element.appendChild(arguments.callee(array[2]));
			}

		} else if(typeof array[2] === 'string') {
			element.insertAdjacentHTML('BeforeEnd', array[2]);
			// element.textContent = array[2]; // textContentじゃダメ　HTMLとして扱わないと
		}

		return element;
	}

	var showing = '', page = [], sorting = $('#sorting').val(), getting = false, end = [], nothingText = '検索結果がありません。';

	function updateNickname(nickname) {
		
		$('#account').find('.result').text('変更中...');

		$.post('/mypage/nickname.json', {
			'nickname': nickname

		}, function (d) {
			$('.user_info_nickname').text(d.nickname);
			$('#account').find('.result').text('変更が完了しました！');
		});
	}

	function getCodeList(flg, page, sorting) {
		// flg: upload or favorite
		getting = true;

		var box = $('#' + flg), data = {
			'p': page
		};

		if (!page) {
			box.find('.user-list').html('');
		}

		if (sorting) {
			data['s'] = sorting;
		}

		$.get('/mypage/' + flg + '.json', data, function (d) {
			var elm;

			if (0 < d.html[2].length) {
				elm = generateElement(d.html);
			
			} else {
				elm = generateElement(['div', '', ['div', '', nothingText]]);
			}

			box.find('.user-list').append($(elm).find('>')).find('.added').powerTip({
				'placement': 'w',
				'offset': 15
			}).removeClass('added');
			getting = false;
			end[flg] = d.end;

		}, 'json');
	}

	var removeList = (function () {
		var loading = false;

		return function (id, flg) {

			if(!loading && window.confirm('本当に削除しますか？')) {
				loading = true;

				$.post('/mypage/remove/' + flg, {
					'code_id': id

				}, function (d) {
					loading = false;
					if (!d['error']) {
						$('[class="' + flg + '-' + id + '"]').remove();

						// 要素数が0になったら'検索結果がありません'と表示する
						if (0 === $('[class^="' + flg + '-"').size()) {
							$('#' + flg).find('.user-list').html(nothingText);
						}
					}
				});
			}
		}
	}());


	$('#control-panel a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});


	$('.form-nickname').submit(function () {
		updateNickname($('#user-nickname').val());

		return false;
	});


	$('#control-panel > li').mousedown(function () {
		var loading = [];

		return function () {
			var panel = $(this).find('a').attr('href').substr(1);

			// 投稿一覧がクリックされたけどまだロードしていない場合
			if (panel !== 'account' && !loading[panel]) {
				getCodeList(panel, 0);
				loading[panel] = true;
			}

			if (panel === 'account') {
				$('#account').find('.result').text('');
			}
		}

	}()).click(function () {
		var panel = $(this).find('a').attr('href').substr(1);
		showing = panel;
		$(window).scrollTop(0);
	});


	// お気に入り・投稿削除
	$('.user-list').on('mousedown', '.remove', function () {
		removeList($(this).data('code-id'), $(this).data('flg'));

		return false;
	});


	// 履歴削除
	$('.removehistory').click(function () {

		if(window.confirm('本当に削除しますか？')) {
			var flg = $(this).data('history');

			$.post('/mypage/removehistory/' + flg + '.json', function (d) {
				$('#' + flg).find('.user-list').html(nothingText);
			});
		}
	});


	// 投稿リスト並び替え
	$('#sorting').change(function () {
		sorting = $(this).val();
		page[showing] = 0;
		getCodeList('upload', page[showing], sorting);
	});


	// 下にスクロールしたら続きを自動取得
	$(window).bind("scroll", function() {

		if (!getting && !end[showing]) {
			scrollHeight = $(document).height();
			scrollPosition = $(window).height() + $(window).scrollTop();

			if ( (scrollHeight - scrollPosition) / scrollHeight <= 0.15) {
				page[showing] = (page[showing]|0) + 1;
				getCodeList(showing, page[showing], sorting);

			} else {
				//それ以外のスクロールの位置の場合
			}
		}
	});
});
