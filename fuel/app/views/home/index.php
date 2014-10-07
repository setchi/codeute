<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>

<?php
	echo Asset::css("lib/common.css");

	Casset::css("powertip/jquery.powertip-blue.min.css");
	Casset::css("common.css");
	Casset::css("index.css");

	if ($user_info) {
		Casset::css("search.css");
	}

	echo Casset::render_css();
?>
</head>

<body>
<?php echo $header; ?>
<div class="wrapper">

<?php if ($user_info) { // ユーザー向け ?>
<div class="control-box">
	<div>
		<div class="container-fluid">
			<h3 class="search-query">全コード一覧
				<div class="pull-right">
					<select class="select-lang">
						<option selected value="all">全ての言語</option>
						<?php echo $lang_list; ?>
					</select>&nbsp;
					<select class="select-sorting">
						<option selected value="date_desc">投稿が新しい順</option>
						<option value="date_asc">投稿が古い順</option>
						<option value="play_desc">プレイ数の多い順</option>
						<option value="play_asc">プレイ数の少ない順</option>
						<option value="length_desc">コードが長い順</option>
						<option value="length_asc">コードが短い順</option>
						<option value="ranking_desc">ランク登録が多い順</option>
						<option value="ranking_asc">ランク登録が少ない順</option>
					</select>
				</div>
			</h3>
		</div>
	</div>
</div>
<?php } ?>

<div class="container">

<?php if (!$user_info) { // ゲスト向け ?>
	<div class="hero-unit">
<?php } else { // ユーザー向け ?>
	<div class="well">
<?php } ?>

		<div class="container-fluid">
			<div class="row-fluid">
			
        	<?php if (!$user_info) { // ゲスト向け ?>
				<h1><span class="logo audiowide">Codeute!</span></h1>
				<p>コーデュートは、書いたコードをタイピングゲームにして遊べるWebアプリです。</p>
				<?php // <p>これまでに40人が、304行タイピングしました。</p> ?>
				<hr>
				<ul class="unstyled snslogin">
					<li><a href="auth/login/facebook" class="login-btn-facebook sns-login" data-powertip="Facebookでログイン"></a></li>
					<li><a href="auth/login/twitter" class="login-btn-twitter sns-login" data-powertip="Twtterでログイン"></a></li>
					<li><a href="auth/login/github" class="login-btn-github sns-login" data-powertip="GitHubでログイン"></a></li>
				</ul>

	        <?php } else { // ユーザー向け ?>

				<div class="centered">
					<h1><span class="logo audiowide">Codeute!</span></h1>
					<?php print "<span class=\"audiowide\">ようこそ".$user_info['nickname']."さん!!</span>" ?><br>
					<hr>
					<select class="select-lang">
						<option selected value="all">全ての言語</option>
						<?php echo $lang_list; ?>
					</select>
					&nbsp;&nbsp;=&gt;&nbsp;&nbsp;
					<select class="select-sorting">
						<option value="favorited">お気に入り</option>
						<option selected value="date_desc">投稿が新しい順</option>
						<option value="date_asc">投稿が古い順</option>
						<option value="play_desc">プレイ数の多い順</option>
						<option value="play_asc">プレイ数の少ない順</option>
						<option value="length_desc">コードが長い順</option>
						<option value="length_asc">コードが短い順</option>
						<option value="ranking_desc">ランク登録が多い順</option>
						<option value="ranking_asc">ランク登録が少ない順</option>
					</select>
				</div>

				<ul id="result" class="thumbnails"><li class="ajax_loading"><div class="ajax_loading_inner"><div id="block_1" class="barlittle"></div><div id="block_2" class="barlittle"></div><div id="block_3" class="barlittle"></div><div id="block_4" class="barlittle"></div><div id="block_5" class="barlittle"></div></div></li></ul>
	        <?php } ?>

			</div>
		</div>
	</div>

<?php if (!$user_info) { // ゲスト向け ?>
	<div class="container-fluid">
		<div class="row-fluid small-box">
			<div class="well span4">
				<h4>幅広い言語に対応</h4>
				<ul>
					<li>RustやDartなどのモダンな言語はもちろん、PHPからx86アセンブリまで計<?php echo count(Model_Code::$nickname) ?>種類の言語に対応しています。</li>
				</ul>
			</div>
			<div class="well span4">
				<h4>独自の字句解析</h4>
				<ul>
					<li>文法に関係のない空白文字は省略して入力できます。また、コメントアウト部分は自動的に無視します。</li>
				</ul>
			</div>
			<div class="well span4">
				<h4>自由な外観設定</h4>
				<ul>
					<li>カラーテーマ(46色)／フォントサイズ(9段階)／ツールチップ(8色)を、それぞれ好きなように選択できます。</li>
				</ul>
			</div>
		</div>
	</div>
<?php } ?>

	<?php echo $footer; ?>
	<div class="fb-like" data-href="https://codeute.com/" data-width="150" data-colorscheme="dark" data-layout="button_count" data-show-faces="false" data-send="false"></div>&nbsp;
	<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://codeute.com/" data-lang="ja" data-hashtags="codeute">ツイート</a>
</div>

</div>
<?php
	//* Library
	echo Asset::js('lib/jquery.min.js');

	if ($user_info) {
		echo Asset::js('src/ace.js');
	}
	
	Casset::js('lib/bootstrap.min.js');
	Casset::js('lib/jquery.powertip.min.js');
	
	// MyScript
	/*
	Casset::js('common.js');

	if ($user_info) {
		Casset::js('search.js');
	}

	Casset::js('index.js');
	*/

	if ($user_info)
	{
		Casset::js('min/index-search.min.js');
	}
	else
	{
		Casset::js('min/index.min.js');
	}

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
	Casset::js('sdk/TwitterSDK.js');
	echo Casset::render_js();
	
	/*/
	echo Asset::js('lib/jquery.min.js');
	echo Asset::js('lib/bootstrap.min.js');
	echo Asset::js('lib/jquery.powertip.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	echo Asset::js('common.js');
	echo Asset::js('index.js');

	echo Asset::js('sdk/GoogleAnalytics.js');
	echo Asset::js('sdk/FaceBookSDK.js');
	echo Asset::js('sdk/TwitterSDK.js');
	//*/
?>

</body>
</html>
