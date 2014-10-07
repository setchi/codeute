<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>

<?php
	echo Asset::css("lib/common.css");
	
	Casset::css("common.css");
	Casset::css("search.css");

	echo Casset::render_css();
?>
</head>

<body>
<?php echo $header; ?>
<div class="wrapper">
<div class="control-box">
	<div>
		<div class="container-fluid">
			<div class="row-fluid"><div class="hidden" id="query"><?php echo htmlspecialchars($query); ?></div>
		<?php
		// echo $wakati.'<br>';
		// echo DB::last_query();
		if (!$query) { ?>
				<h3 class="search-query">全コード一覧
		<?php } else { ?>
				<h3 class="search-query">&quot;<?php echo htmlspecialchars($query); ?>&quot; の検索結果
		<?php } ?>
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
	</div> <!-- hero-unit -->
</div>
<div class="container">
	<div class="well result-box">
		<div class="container-fluid">
			<div class="row-fluid"><div class="hidden"><?php echo htmlspecialchars($query); ?></div>
			<?php
			// echo $wakati.'<br>';
			// echo DB::last_query();
			if (!$query) { ?>
				<h3 class="search-query">全コード一覧
			<?php } else { ?>
				<h3 class="search-query">&quot;<?php echo htmlspecialchars($query); ?>&quot; の検索結果
			<?php } ?>
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
				<hr class="sharpen">
			</div>
			<div class="row-fluid">
				<ul id="result" class="thumbnails"><li class="ajax_loading"><div class="ajax_loading_inner"><div id="block_1" class="barlittle"></div><div id="block_2" class="barlittle"></div><div id="block_3" class="barlittle"></div><div id="block_4" class="barlittle"></div><div id="block_5" class="barlittle"></div></div></li></ul>
			</div>
		</div>
	</div> <!-- hero-unit -->

	<?php echo $footer; ?>
	<div class="fb-like" data-href="https://codeute.com/" data-width="150" data-colorscheme="dark" data-layout="button_count" data-show-faces="false" data-send="false"></div>&nbsp;
	<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://codeute.com/" data-lang="ja" data-hashtags="codeute">ツイート</a>
				
</div>

</div>
<?php
	echo Asset::js('lib/jquery.min.js');
	echo Asset::js('src/ace.js');
	// echo Asset::js('src/ext-static_highlight.js');

	//* Library
	Casset::js('lib/bootstrap.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	/*
	Casset::js('common.js');
	Casset::js('search.js');
	/*/
	Casset::js('min/search.min.js');

	Casset::js('sdk/GoogleAnalytics.js');
	Casset::js('sdk/FaceBookSDK.js');
	Casset::js('sdk/TwitterSDK.js');
	echo Casset::render_js();

	/*/

	echo Asset::js('lib/bootstrap.min.js');
	// Casset::js('lib/amplify.min.js');
	
	// MyScript
	echo Asset::js('common.js');
	echo Asset::js('search.js');

	echo Asset::js('sdk/GoogleAnalytics.js');
	echo Asset::js('sdk/FaceBookSDK.js');
	echo Asset::js('sdk/TwitterSDK.js');
	//*/
?>
</body>
</html>
