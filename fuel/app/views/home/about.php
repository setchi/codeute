<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>

<?php
	echo Asset::css("lib/common.css");
	
	Casset::css("common.css");
	Casset::css("about.css");

	echo Casset::render_css();
?>
</head>

<body>
<?php echo $header; ?>

<div class="wrapper">
<div class="container">
	<div class="hero-unit flat">
		<div class="container-fluid">
			<div class="row-fluid">
				<ul class="nav nav-tabs">
					<li class="active"><a href="#about" data-toggle="tab">About</a></li>
					<li><a href="#tips" data-toggle="tab">Tips</a></li>
					<li><a href="#history" data-toggle="tab">更新履歴</a></li>
					<li><a href="#messages" data-toggle="tab">謝辞</a></li>
				</ul>
				<div class="tab-content">
					<div class="tab-pane active" id="about">
						<div class="message">
							<h4 class="audiowide">Codeute!&nbsp;について</h4>
							<div class="about-contents">
								コーデュートは、書いたコードをタイピングゲームにして遊べるWebアプリです。<br>
								文法に関係のない空白文字は飛ばして入力できるので、ストレスなくタイピングできます。
							</div>
						</div>
						<hr class="sharpen">
						<div class="message">
							<h4>対応ブラウザ</h4>
							<div class="about-contents">
								<ul class="unstyled">
									<li class="browser-icon chrome" title="GoogleChrome"></li>
									<li class="browser-icon opera" title="Opera"></li>
									<li class="browser-icon firefox" title="FireFox"></li>
								</ul>
							</div>
						</div>
						<hr class="sharpen">
						<div class="message">
							<h4>制作者</h4>
							<div class="about-contents">
								<p><a href="https://twitter.com/intent/user?screen_name=setchi_">@setchi_</a></p>
							</div>
						</div>
					</div>
					<div class="tab-pane" id="tips">
						<div class="message">
							<h4>ショートカットについて</h4>
							<div class="about-contents">
								タイピングページで下記のショートカットが使えます。
								<ul class="unstyled">
									<li>Esc => 中断＆リトライ</li>		
									<li>Ctrl + S => キーボード表示切替</li>					
								</ul>
							</div>
						</div>
					</div>
					<div class="tab-pane" id="history">
						<div class="message">
							<h4>更新履歴</h4>
							<div class="about-contents">
								<ul class="unstyled">
									<li>2013-10-12 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/12/234530" target="_blank">コード一覧でランキングの順位を表示</a></li>
									<li>2013-10-11 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/11/223255" target="_blank">レーティングの計算式</a></li>
									<li>2013-10-10 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/10/234224" target="_blank">2013/10/10の変更点</a></li>
									<li>2013-10-09 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/09/211556" target="_blank">2013/10/09の変更点</a></li>
									<li>2013-10-08 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/08/194953" target="_blank">総合ランキングを実装しました</a></li>
									<li>2013-10-07 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/07/223513" target="_blank">ESCキーでのリトライ機能を実装しました</a></li>
									<li>2013-10-06 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/06/232139" target="_blank">結果画面を修正しました</a></li>
									<li>2013-10-05 =>&nbsp;<a href="http://setchi-q.hatenablog.com/entry/2013/10/05/204938" target="_blank">β版公開しました。</a></li>					
								</ul>
							</div>
						</div>
					</div>
					<div class="tab-pane" id="messages">
						<div class="message">
							<h4>謝辞</h4>
							<div class="about-contents">
								<p>コーデュートは、下記を利用して開発しました。</p>
								<ul class="unstyled">
									<li><a href="http://ace.c9.io" target="_blank">Ace</a><small>&nbsp;/&nbsp;ブラウザベースコードエディタ</small></li>
									<li><a href="http://www.highcharts.com" target="_blank">Highcharts</a><small>&nbsp;/&nbsp;データ可視化ライブラリ</small></li>
									<li><a href="http://jquery.com" target="_blank">jQuery</a><small>&nbsp;/&nbsp;JavaScriptライブラリ</small></li>
									<li><a href="http://stevenbenner.github.io/jquery-powertip/" target="_blank">PowerTip</a><small>&nbsp;/&nbsp;jQueryプラグイン&nbsp;ツールチップ</small></li>
									<li><a href="https://datatables.net" target="_blank">dataTables</a><small>&nbsp;/&nbsp;jQueryプラグイン&nbsp;テーブル修飾</small></li>
									<li><a href="http://getbootstrap.com/" target="_blank">Bootstrap</a><small>&nbsp;/&nbsp;CSSフレームワーク</small></li>
									<li><a href="http://fuelphp.com/" target="_blank">FuelPHP</a><small>&nbsp;/&nbsp;PHPフレームワーク</small></li>
									<li><a href="http://www.google.com/fonts/specimen/Audiowide" target="_blank">Audiowide</a><small>&nbsp;/&nbsp;Google Web Fonts</small></li>						
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div> <!-- hero-unit -->

  <?php echo $footer; ?>
	<div class="fb-like" data-href="https://codeute.com/" data-width="150" data-colorscheme="dark" data-layout="button_count" data-show-faces="false" data-send="false"></div>&nbsp;
	<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://codeute.com/" data-lang="ja" data-hashtags="codeute">ツイート</a>
</div>

</div>
<?php
// echo Asset::js('src-min/ace.js');

	// Library
	echo Asset::js('lib/jquery.min.js');
	
	Casset::js('lib/bootstrap.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	Casset::js('common.js');

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
	Casset::js('sdk/TwitterSDK.js');
	echo Casset::render_js();
?>
</body>
</html>