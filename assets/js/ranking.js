$(function () {
var rootpath = '/';

	$('.select-lang').change(function () {
		updateRankingTable($(this).val());
	});

	updateRankingTable('all');

function updateRankingTable(lang) {
	var rankingTable = null, $rankingTable = $("#rankingTable");

	// ランキング取得
	rankingTable = $rankingTable.dataTable({
		bDestroy: true,
		bJQueryUI: true,
		iDisplayLength: 100,
	    // 遅延レンダリングを設定します。
	    // trueにするとAjax通信を非同期で行います。
	    bDeferRender: true,

	    // 列設定です。
	    // mDataとjsonの各項目をマッピングします。
	    aoColumns: [
	        { mData: "rank", sDefaultContent: "", "sTitle":"順位", sClass: 'col-center r-rank' },
	        { mData: "user_name", sDefaultContent: "", "sTitle":"ニックネーム", sClass: 'col-left r-user_name' },
	        { mData: "rating", sDefaultContent: "", "sTitle":"レーティング", sClass: 'col-right r-total_score', fnRender: function (o) {
	        	return (+o.aData['rating']).toFixed(0);
	        }},
	        { mData: "type_speed", sDefaultContent: "", "sTitle":"平均速度(打/秒)", sClass: 'col-right r-type_speed', fnRender: function (o) {
	        	return (+o.aData['type_speed']).toFixed(2);
	        }},
	        { mData: "miss_rate", sDefaultContent: "", "sTitle":"平均ミス率(%)", sClass: 'col-right r-miss_rate', fnRender: function (o) {
	        	return (+o.aData['miss_rate']).toFixed(2);
	        }}/*,
	        { mData: "regist_num", sDefaultContent: "", "sTitle":"参戦数", sClass: 'col-right r-regist_num' , fnRender: function (o) {
	        	return (+o.aData['regist_num']).toFixed(0);
	        }  }//*/
	    ],
	    // Ajaxの接続先を設定します。
	    sAjaxSource: rootpath + 'ranking/totalranking/' + lang + '.json?' + (new Date().getTime()),
	    // Ajax通信方式を設定します。
	    sServerMethod: "post",
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
};

});