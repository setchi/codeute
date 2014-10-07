<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>

<?php
	echo Asset::css("lib/common.css");
	
	Casset::css("common.css");
	Casset::css("newuser.css");

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
				<h3>ニックネームを設定してください。</h3>
				<p>コードのアップロード時や、ランキング参加時に公開されるニックネームです。</p>
				<form class="form-vertical" action="account/newuser" method="post">
		            <div class="control-group">
		              <label class="control-label"></label>
		              <div class="controls docs-input-sizes">
		              	<input required type="text" name="nickname" id="nickname" minlength="2" maxlength="25" class="" placeholder="" value="<?php echo $user_info['nickname'] ?>">
		              	<input type="submit" class="btn btn-large pull-right audiowide" value="OK"><br>
						<small>※登録後、マイページから変更することができます。</small>
		              </div>
		            </div>
	            </form>
			</div>
		</div>
	</div> <!-- hero-unit -->

  <?php echo $footer; ?>
</div>

</div> <!-- wrapper -->
<?php
// echo Asset::js('src-min/ace.js');

	// Library
	echo Asset::js('lib/jquery.min.js');
	
	Casset::js('lib/bootstrap.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	Casset::js('common.js');
	Casset::js('newuser.js');

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
	Casset::js('sdk/TwitterSDK.js');
	echo Casset::render_js();
?>
</body>
</html>