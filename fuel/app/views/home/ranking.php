<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β} | 総合ランキング</title>

<?php
	echo Asset::css("lib/common.css");
	
	Casset::css("common.css");
	Casset::css("ranking.css");

	Casset::css("lib/jquery-ui.css");
	Casset::css("lib/datatables/jquery.dataTables.css");
	Casset::css("lib/datatables/jquery.dataTables_themeroller.css");

	echo Casset::render_css();
?>
</head>

<body>
<?php echo $header; ?>

<div class="wrapper">
<div class="container">
	<div class="well flat">
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="pull-right">
					<select class="select-lang">
						<option selected value="all">全ての言語</option>
						<?php echo $lang_list; ?>
					</select>
				</div>
				<?php echo $user_info ? '' : '<span style="color:rgb(255, 255, 105);text-align:center;">ログインするとランキングに参加できます。</span>' ?>
				<h3>総合ランキング{β}</h3>

				<table id="rankingTable"></table>
			</div>
		</div>
	</div> <!-- hero-unit -->

  <?php echo $footer; ?>
	<div class="fb-like" data-href="https://codeute.com/ranking" data-width="150" data-colorscheme="dark" data-layout="button_count" data-show-faces="false" data-send="false"></div>&nbsp;
	<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://codeute.com/ranking" data-lang="ja" data-hashtags="codeute">ツイート</a>
</div>

</div>
<?php
// echo Asset::js('src-min/ace.js');

	// Library
	echo Asset::js('lib/jquery.min.js');
	
	Casset::js('lib/bootstrap.min.js');
	Casset::js('lib/jquery.dataTables.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	Casset::js('common.js');
	Casset::js('ranking.js');

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
	Casset::js('sdk/TwitterSDK.js');
	echo Casset::render_js();
?>
</body>
</html>