<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>

<?php
	echo Asset::css("lib/common.css");

	Casset::css("powertip/jquery.powertip-.min.css");
	Casset::css("common.css");
	Casset::css("mypage.css");

	echo Casset::render_css();
?>
</head>

<body>
<?php echo $header; ?>
<div class="wrapper">
	<div class="container">
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="span4 sidebar well">
					<ul class="nav nav-pills nav-stacked" id="control-panel">
						<li class="active"><a class="tab-button" href="#account">アカウント設定</a></li>
						<!--<li><a class="tab-button" href="#ranking">参加中のランキング</a></li>-->
						<li><a class="tab-button" href="#favorite">お気に入り一覧</a></li>
						<li><a class="tab-button" href="#upload">投稿一覧</a></li>
						<li><a class="tab-button" href="#play">タイピング履歴</a></li>
						<li><a class="tab-button" href="#view">閲覧履歴</a></li>
					</ul>
				</div>

				<div class="span8 well tab-content">
					<div class="tab-pane active in" id="account">
						<form class="form-horizontal form-nickname">
							<fieldset>
								<legend>アカウント設定</legend>
								<div class="control-group">
									<label class="control-label" for="user-nickname">ニックネーム</label>
									<div class="controls">
										<input required type="text" minlength="2" maxlength="25" class="input-xlarge" id="user-nickname" value="<?php echo $user_info['nickname'] ?>">
										<!--<p class="help-block">補助説明</p>-->
									</div>
								</div>
								<div class="form-actions">
									<button type="submit" class="btn btn-primary">変更を保存する</button><span class="result"></span>
								</div>
							</fieldset>
						</form>
					</div>

					<div class="tab-pane" id="play">
						<form class="form-horizontal">
							<fieldset>
								<legend>タイピング履歴<div class="removehistory pull-right btn" data-history="play">履歴を削除</div></legend>
								<ul class="user-list nav nav-pills nav-stacked"></ul>
							</fieldset>
						</form>
					</div>

					<div class="tab-pane" id="view">
						<form class="form-horizontal">
							<fieldset>
								<legend>閲覧履歴<div class="removehistory pull-right btn" data-history="view">履歴を削除</div></legend>
								<ul class="user-list nav nav-pills nav-stacked"></ul>
							</fieldset>
						</form>
					</div>

					<div class="tab-pane" id="upload">
						<form class="form-horizontal">
							<fieldset>
								<legend>投稿一覧
									<div class="pull-right">
										<select id="sorting">
											<option selected value="date_desc">投稿が新しい順</option>
											<option value="date_asc">投稿が古い順</option>
											<option value="play_desc">プレイ数の多い順</option>
											<option value="play_asc">プレイ数の少ない順</option>
											<option value="view_desc">訪問数の多い順</option>
											<option value="view_asc">訪問数の少ない順</option>
											<option value="length_desc">コードが長い順</option>
											<option value="length_asc">コードが短い順</option>
										</select>
									</div>
								</legend>
								<ul class="user-list nav nav-pills nav-stacked"></ul>
							</fieldset>
						</form>
					</div>
<!--
					<div class="tab-pane" id="ranking">
						<form class="form-horizontal">
							<fieldset>
								<legend>参加ランキング
									<div class="pull-right">
										<select id="sort-ranking">
											<option selected value="rank_ask">順位が高い順</option>
											<option value="rank_desc">順位が低い順</option>
											<option value="score_desc">登録スコアが高い順</option>
											<option value="score_asc">登録スコアが低い順</option>
											<option value="ninzu_desc">参加者数が多い順</option>
											<option value="ninzu_asc">参加者数が少ない順</option>
										</select>
									</div>
								</legend>
								<ul class="user-list nav nav-pills nav-stacked"></ul>
							</fieldset>
						</form>
					</div>
-->
					<div class="tab-pane" id="favorite">
						<form class="form-horizontal">
							<fieldset>
								<legend>お気に入り一覧</legend>
								<ul class="user-list nav nav-pills nav-stacked"></ul>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>


  	<?php echo $footer; ?>
	</div> <!-- hero-unit -->

</div>

</div> <!-- wrapper -->
<?php
// echo Asset::js('src-min/ace.js');

	// Library
	echo Asset::js('lib/jquery.min.js');
	
	Casset::js('lib/bootstrap.min.js');
	Casset::js('lib/jquery.powertip.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	/*
	Casset::js('common.js');
	Casset::js('mypage.js');
	//*/
	Casset::js('min/mypage.min.js');

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
	Casset::js('sdk/TwitterSDK.js');
	echo Casset::render_js();
?>
</body>
</html>
