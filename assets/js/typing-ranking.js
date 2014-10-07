var rankingRegister = (function () {
	var entered = false;

	return function(codeId, status, btn) {

		if (entered) {
			return;
		} else {
			entered = true;
		}

		function ajaxRegister() {
			btn.html('登録中…').addClass('disabled');

			$.ajax({
				type: 'post',
				url: rootpath + 'ranking/register.json',
				data: {
					'code_id': codeId,
					'total_score': status.totalScore,
					'total_time': status.totalTime,
					'type_speed': status.speedPerSec,
					'miss_rate': status.missRate,
					'max_combo': status.comboMax
				}

			}).done(function (d) {
				var rating = Math.round(d['diff']);
				
				if (0 <= rating) {
					rating = '<span class="up">+' + rating + ' pt</span>';

				} else {
					rating = '<span class="down">' + rating + ' pt</span>';
				}

				rating = '登録完了！ ' + rating;
				btn.html(rating);
				entered = false;

			}).fail(function () {
				console.log('ajax retry');
				ajaxRegister();
			});
		}

		ajaxRegister();
	}
}());

var updateRankingTable = function () {
	var rankingTable = null, $rankingTable = $("#rankingTable");

	// ランキング取得
	rankingTable = $rankingTable.dataTable({
		bDestroy: true,
		bJQueryUI: true,
	    // 遅延レンダリングを設定します。
	    // trueにするとAjax通信を非同期で行います。
	    bDeferRender: true,

	    // 列設定です。
	    // mDataとjsonの各項目をマッピングします。
	    aoColumns: [
	        { mData: "rank", sDefaultContent: "", "sTitle":"順位", sClass: 'col-center r-rank' },
	        { mData: "user_name", sDefaultContent: "", "sTitle":"ニックネーム", sClass: 'col-left r-user_name' },
	        { mData: "total_score", sDefaultContent: "", "sTitle":"スコア", sClass: 'col-right r-total_score' , fnRender: function (o) {
	        	return Math.round(+o.aData['total_score']);
	        } },
	        { mData: "type_speed", sDefaultContent: "", "sTitle":"タイプスピード(打/秒)", sClass: 'col-right r-type_speed' , fnRender: function (o) {
	        	return (+o.aData['type_speed']).toFixed(2);
	        } },
	        { mData: "miss_rate", sDefaultContent: "", "sTitle":"タイプミス(%)", sWidth: "198px", sClass: 'col-right r-miss_rate' , fnRender: function (o) {
	        	return (+o.aData['miss_rate']).toFixed(1);
	        }  }
	        // { mData: "total_time", sDefaultContent: "", "sTitle":"経過時間", sClass: 'col-right r-total_time' },
	        /*
	        { mData: "date", sDefaultContent: "", "sTitle":"日時", sWidth: "300px", sClass: 'col-right r-date', fnRender: function (o) {
	        	return o.aData['date'].substr(0, 10);
	        } }
	        /**/
	    ],
	    // Ajaxの接続先を設定します。
	    sAjaxSource: rootpath + 'ranking/list/' + codeId + '.json?' + (new Date().getTime()),
	    // Ajax通信方式を設定します。
	    sServerMethod: "POST",
	    // サーバへ送るリクエストパラメータを設定します。
	    // 今回はjsonファイルへのリクエストなので本当は必要ありません。
	    /*
	    fnServerParams: function (aoData) {
	        aoData.push({"name": "id", "value": "1"});
	    },
	    //*/
	    // 取得JSONのルート文字列を設定します。
	    // 省略した場合のデフォルト値は「aaData」です。
	    sAjaxDataProp: "list",
		"oLanguage": {
			"sLengthMenu": "表示行数 _MENU_ 件",
			"oPaginate": {
				"sNext": "次へ",
				"sPrevious": "前へ"
			},
			"sInfo": "全_TOTAL_件中 _START_-_END_件表示",
			"sSearch": "検索："
		}
	});

	return function () {
		rankingTable.fnReloadAjax();
	}
};
