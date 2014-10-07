<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>

<?php
	echo Asset::css("lib/common.css");
	
	Casset::css("common.css");
	Casset::css("404.css");

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
				<h2>404 Not Found</h2><hr class="sharpen">
				<div class="message">
					<h3>ご指定のページが見つかりません。</h3>
					<p>URLが間違っているか、変更・削除された可能性があります。</p>
					<p><a href="/">トップページに戻る&nbsp;&gt;&gt;</a></p>
				</div>
			</div>
		</div>
	</div> <!-- hero-unit -->

  <?php echo $footer; ?>
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