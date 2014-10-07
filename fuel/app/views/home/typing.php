<?php
$user_info = $user_info;
$title = 'コーデュート! {β} | '.$code_data['title'];
$og_description = $code_data['description'] ? $code_data['description'] : '書いたコードをタイピングゲームにして遊ぼう！';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="keywords" content="Codeute,コード,プログラム,タイピング">
<meta name="description" content="書いたコードをタイピングゲームにして遊べます。">

<meta name="google-site-verification" content="GEuKa5hhYaQOOGVIul6fvgV6nUq9zs3igHpqrMigzxw">
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@codeute">
<meta name="twitter:creator" content="@setchi_">
<meta property="fb:app_id" content="607472932619133">
<meta property="og:title" content="<?php echo $title ?>">
<meta property="og:description" content="<?php echo $og_description ?>">
<meta property="og:url" content="https://codeute.com/<?php echo $code_data['code_id'] ?>">
<meta property="og:image" content="https://codeute.com/assets/img/fv.png">
<meta property="og:type" content="website">

<link rel="shortcut icon" href="//codeute.com/assets/img/favicon.png">

  <title><?php echo $title ?></title>
<?php
	echo Asset::css("powertip/jquery.powertip-light.min.css", array('class' => 'powertip-css'));
	echo Asset::css("lib/common.css");

	Casset::css("lib/jquery-ui.css");
	Casset::css("lib/datatables/jquery.dataTables.css");
	Casset::css("lib/datatables/jquery.dataTables_themeroller.css");
	Casset::css("common.css");
	Casset::css("typing.css");
	Casset::css("keyboard.css");

	echo Casset::render_css();
?>
</head>

<body>
  <?php echo $header; ?>
<div class="wrapper">
  <div class="container" data-code-id="<?php echo $code_data['code_id'] ?>">
    <div id="loading">
      <div id="loadingCircle">
          <div class="circle"></div><div class="circle1"></div>
      </div>
    </div>

    <div id="code-header">
    <?php
    	$favorite_class = "";
    	$favorite_title = "";

    	if ($user_info)
    	{
    		$favorite_class = "togglefav";

    		if ($code_data['favorited'])
    		{
    			$favorite_title = "お気に入りから削除";
    			$favorite_class .= ' favorited';
    		}
    		else
    		{
    			$favorite_title = "お気に入りに追加";
    		}
    	}
    ?>
	  <span class="header-title code-open <?php echo $code_data['open'] ?>" <?php if ($code_data['open'] === 'private') { echo 'title="このコードは非公開に設定されています"'; } ?>><span class="code-favorite <?php echo $favorite_class; ?>" data-favorite-id="<?php echo $code_data['code_id'] ?>" title="<?php echo $favorite_title; ?>"><span class="code-title"><?php echo $code_data['title'] ?></span></span></span><span class="vertical-line">=></span><span class="header-language"><?php echo Model_Code::get_code_nickname($code_data['code_language']) ?></span>
	  <?php if ($code_data['user_id'] === $user_info['id']) { ?>
	  	<a href="/edit/<?php echo $code_data['code_id']; ?>" class="btn span2 pull-right">コードを編集</a>
	  <?php } ?>
      <ul class="nav nav-tabs">
        <li class="tab-button active"><a href="#typing" data-toggle="tab">タイピング</a></li>
        <li class="tab-button "><a href="#profile" data-toggle="tab">詳細</a></li>
        <li class="tab-button"><a href="#ranking" data-toggle="tab">ランキング</a></li>
        <li class="label pull-right">プレイ数: <span class="play-num"></span></li>
        <li class="pull-right share">
          <div class="fb-like" data-href="https://codeute.com/<?php echo $code_data['code_id'] ?>" data-width="150" data-colorscheme="dark" data-layout="button_count" data-show-faces="false" data-send="false"></div>&nbsp;
          <span id="twitter"></span>
        </li>
      </ul>
    </div> <!-- #code-header -->

    <div class="well flat" id="code-body">
      <div class="tab-content">

        <div class="tab-pane active in" id="typing">

          <div id="effectLayer">
            <div class="animate">
              <span class="effect-bar">最初の文字を押すとスタートします。</span>
              <span class="effect-start audiowide">&nbsp;START!</span>
              <span class="effect-fin audiowide">&nbsp;FINISH!</span>
            </div>
            <span class="effect-mask"></span>
          </div>
          
          <div id="typingLayer" data-code-info="<?php echo $code_data['code_language'].'/'.$code_data['editor_theme'].'/'.$code_data['font_size'].'/'.$code_data['tip_color'] ?>">
            <div id="mirrorLayer" class="full"></div>
            <div id="viewLayer" class="full"><pre><?php echo $code_data['code'] ?></pre></div>
            <div id="typeLayer" class="full"></div>
          </div>

          <div id="resultLayer">
            <div id="result-rank"></div>
            <div id="result-chart"></div>
            <div id="result-heatmap"></div>
          </div>

          <?php echo $keyboard; ?>
        </div>

        <div class="tab-pane" id="profile">
          <div class="info-head">
            <span class="label">投稿者</span><span class="info-label"><?php echo /*'<img class="user-icon" src="'.$upload_user['image'].'">'.*/$code_data['nickname'] ?></span>
            <span class="label">投稿日</span><span class="info-label"><?php echo mb_substr(htmlspecialchars($code_data['date']), 0, 10) ?></span>
            <span class="label">お気に入り</span><span class="info-label favorited-num"></span>
            <span class="label">閲覧数</span><span class="info-label view-num"></span>
            <hr class="sharpen">
            <pre class="description"><?php echo $code_data['description'] ? $code_data['description'] : '説明文はありません。' ?></pre>
          </div>
          <div id="detailLayer"></div>
        </div>

        <div class="tab-pane" id="ranking">
        <?php if(!$user_info) { ?>
          <div style="color:rgb(255, 255, 105);text-align:center;">ログインするとランキングに参加できます。</div>
        <?php } ?>
          <table id="rankingTable">
          
          </table>
        </div>
      </div>
    </div>  <!-- code-body -->

    <?php echo $footer; ?>
  </div>

</div>
<?php
	// Library
	echo Asset::js('lib/jquery.min.js');
	echo Asset::js('src/ace.js');

	/*
	Casset::js('lib/bootstrap.min.js');
	Casset::js('lib/jquery.easydrag.js');
	Casset::js('lib/jquery.powertip.min.js');
	Casset::js('lib/highcharts/highstock.js');
	Casset::js('lib/highcharts/themes/dark-green.js');
	Casset::js('lib/jquery.dataTables.min.js');

	Casset::js('common.js');
	Casset::js('nonPassReList.js');
	Casset::js('tokenizer.js');
	Casset::js('code-favorite.js');
	Casset::js('keyboard.js');
	Casset::js('typing-record.js');
	Casset::js('typing-result.js');
	Casset::js('typing-ranking.js');
	Casset::js('typing-model.js');
	Casset::js('typing-screen.js');
	Casset::js('typing-main.js');
	Casset::js('typing-init.js');

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
  //*/
	Casset::js('min/typing.min.js');
	echo Casset::render_js();

	/*/
	echo Asset::js('lib/bootstrap.min.js');
	echo Asset::js('lib/jquery.easydrag.js');
	echo Asset::js('lib/jquery.powertip.min.js');
	echo Asset::js('lib/highcharts/highstock.js');
	echo Asset::js('lib/highcharts/themes/dark-green.js');
	echo Asset::js('lib/jquery.dataTables.min.js');

	// MyScript
	echo Asset::js('common.js');
	echo Asset::js('nonPassReList.js');
	echo Asset::js('tokenizer.js');
	echo Asset::js('code-favorite.js');
	echo Asset::js('keyboard.js');
	echo Asset::js('typing-record.js');
	echo Asset::js('typing-result.js');
	echo Asset::js('typing-ranking.js');
	echo Asset::js('typing-model.js');
	echo Asset::js('typing-screen.js');
	echo Asset::js('typing-main.js');
	echo Asset::js('typing-init.js');

	echo Asset::js('sdk/GoogleAnalytics.js');
	echo Asset::js('sdk/FaceBookSDK.js');
	// echo Asset::js('sdk/TwitterSDK.js');
	// */
?>

</body>
</html>
