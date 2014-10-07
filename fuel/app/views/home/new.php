<?php $user_info = $user_info; //強制trueとかにしたいときに使う ?>
<!DOCTYPE html>
<html lang="ja">
<head>
<?php echo $head; ?>

  <title>コーデュート! {β}</title>
<?php
	echo Asset::css("powertip/jquery.powertip-light.min.css", array('class' => 'powertip-css'));
	echo Asset::css("lib/common.css");

	Casset::css("common.css");
	Casset::css("create.css");

	echo Casset::render_css();
?>
</head>

<body>
  <?php echo $header; ?>
<div class="wrapper">
  <div class="container" id="container">
    <div class="hero-unit">
      <div class="container-fluid"><div class="row-fluid">
        <a data-toggle="modal" href="#settingModal" id="detailsetting"><div class="btn pull-right input detailsetting"><i class="icon-white icon-wrench"></i> 外観変更</div></a>
        <h2><span id="editingLang" class="audiowide">C++</span><span>&nbsp;&nbsp;新規作成</span></h2>

        <form class="form-vertical" id="code-register">

        <?php if ($user_info) { // ログインしているとき(ユーザー向け) ?>
          <fieldset>
            <div class="control-group input pull-right span5">
              <label class="control-label control-right"><span class="audiowide num">2.&nbsp;&nbsp;</span>タイトル・説明文を入力してください</label>
              <div class="controls docs-input-sizes">
                <input required type="text" data-input="title" maxlength="30" class="span12" placeholder="タイトル(必須)">
              </div>
              <div class="controls docs-input-sizes">
                <textarea data-input="description" maxlength="200" class="span12" rows="3" placeholder="説明文(任意)"></textarea>
              </div>
            </div>

            <div class="control-group span5">
              <label class="control-label"><span class="audiowide num">1.&nbsp;&nbsp;</span>言語と公開範囲を選択してください</label>
              <div class="controls docs-input-sizes">
                <select id="mode" class="span8" data-input="code_language">
                <?php echo $lang_list; ?>
                </select>&nbsp;
                <select data-input="open" class="span4">
                  <option selected value="public">公開</option>
                  <option value="private">非公開</option>
                </select>
              </div>
              <div class="controls docs-input-sizes">
              </div>
              <hr class="sharpen">
              <div class="control docs-input-sizes start-button">
                <label class="control-label" for="textarea"><span class="audiowide num">3.&nbsp;&nbsp;</span>下の画面でコードを編集して、ボタンを押してください</label>
                <div class="btn btn-large code-check">&gt;&gt;&nbsp;登録</div>
              </div>
            </div>

            <input type="hidden" name="data">
            <button type="submit" class="hidden"></button>

            <div class=""></div>
          </fieldset>

          <?php
            } else { // ログアウトしているとき(ゲスト向け)
          ?>
          <fieldset>
            <div class="control-group input pull-right start-button span5">
              <label class="control-label" for="textarea"><span class="audiowide num">2.&nbsp;&nbsp;</span>下の画面でコードを編集して、ボタンを押してください</label>
              <div class="btn code-check span12">&gt;&gt;&nbsp;スタート</div>
            </div>

            <div class="control-group span5">
              <label class="control-label"><span class="audiowide num">1.&nbsp;&nbsp;</span>言語を選択してください</label>
              <div class="controls docs-input-sizes">
                <select id="mode" class="span8" data-input="code_language">
                <?php echo $lang_list; ?>
                </select>
              </div>
            </div>
          </fieldset>

          <?php } ?>
        </form>

      </div></div>
      <span class="arrow-right"></span>
    </div> <!-- hero-unit -->
    <div id="editor" class="flat"></div>

    <?php if ($last_session) { ?>
      <div class="hidden" id="last-session"><?php echo $last_session ?></div>
    <?php } else { ?>
      <div class="hidden" id="last-session">c_cpp/ambiance/14/purple</div>
    <?php } ?>

    <?php echo $footer; ?>
  </div>

    <!-- 設定ModalBox -->
    <div class="modal hide fade" id="settingModal" data-element="modal">
      <div class="modal-header">
        <a class="close" data-dismiss="modal">&times;</a>
        <h3 class="page-header">外観設定</h3>
      </div>
      <div class="modal-body">

        <div class="form-horizontal">
          <fieldset>
            <div class="control-group">
              <label class="control-label">カラーテーマ</label>
              <div class="controls">
                <select data-setting="theme">
                  <optgroup label="Bright">
                    <option value="active4d">Active4D</option>
                    <option value="chrome">Chrome</option>
                    <option value="clouds">Clouds</option>
                    <option value="crimson_editor">Crimson Editor</option>
                    <option value="dawn">Dawn</option>
                    <option value="dreamweaver">Dreamweaver</option>
                    <option value="eclipse">Eclipse</option>
                    <option value="github">GitHub</option>
                    <option value="solarized_light">Solarized Light</option>
                    <option value="textmate">TextMate</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="lazy">LAZY</option>
                    <option value="xcode">XCode</option>
                  </optgroup>
                  <optgroup label="Dark">
                    <option value="ambiance">Ambiance</option>
                    <option value="all_hallows_eve">All Hallows Eve</option>
                    <option value="amy">Amy</option>
                    <option value="blackboard">Blackboard</option>
                    <option value="brilliance_black">Brilliance Black</option>
                    <option value="brilliance_dull">Brilliance Dull</option>
                    <option value="carbonnight">Carbonnight</option>
                    <option value="chaos">Chaos</option>
                    <option value="clouds_midnight">Clouds Midnight</option>
                    <option value="cobalt">Cobalt</option>
                    <option value="colonoscopy">Colonoscopy</option>
                    <option value="darkside">Darkside</option>
                    <option value="Earthsong">Earthsong</option>
                    <option value="espresso_libre">Espresso Libre</option>
                    <option value="freshcut">FreshCut</option>
                    <option value="Glowfish">Glowfish</option>
                    <option value="idle_fingers">idleFingers</option>
                    <option value="kr_theme">krTheme</option>
                    <option value="mcedit">Mcedit</option>
                    <option value="merbivore">Merbivore</option>
                    <option value="merbivore_soft">Merbivore Soft</option>
                    <option value="mono_industrial">Mono Industrial</option>
                    <option value="monokai">Monokai</option>
                    <option value="pastel_on_dark">Pastel on dark</option>
                    <option value="Poyeyo_Blue">Poyeyo Blue</option>
                    <option value="solarized_dark">Solarized Dark</option>
                    <option value="terminal">Terminal</option>
                    <option value="tomorrow_night">Tomorrow Night</option>
                    <option value="tomorrow_night_blue">Tomorrow Night Blue</option>
                    <option value="tomorrow_night_bright">Tomorrow Night Bright</option>
                    <option value="tomorrow_night_eighties">Tomorrow Night 80s</option>
                    <option value="twilight">Twilight</option>    
                    <option value="vibrant_ink">Vibrant Ink</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div class="control-group">
              <label class="control-label">フォントサイズ</label>
              <div class="controls">
                <select data-setting="font-size">
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="22">22px</option>
                  <option value="24">24px</option>
                  <option value="26">26px</option>
                  <option value="28">28px</option>
                  <option value="30">30px</option>
                </select>
              </div>
            </div>
            <div class="control-group">
              <label class="control-label">ツールチップ</label>
              <div class="controls">
                <select data-setting="tooltip">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                  <option value="purple">Purple</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="modal-footer">
        <div class="btn btn-primary setting-reset">初期値に戻す</div>
        <a href="#" class="btn" data-dismiss="modal">閉じる</a>
      </div>
    </div>

</div>
<?php
	// Library
	echo Asset::js('lib/jquery.min.js');
	echo Asset::js('src/ace.js');
	
	/*
  Casset::js('lib/bootstrap.min.js');
  Casset::js('lib/jquery.powertip.min.js');

	Casset::js('common.js');
	Casset::js('nonPassReList.js');
	Casset::js('typing-model.js');
	Casset::js('create-model.js');
	Casset::js('create-controller.js');
	Casset::js('create-main.js');

  Casset::js('sdk/GoogleAnalytics.js');
  Casset::js('sdk/FaceBookSDK.js');
  Casset::js('sdk/TwitterSDK.js');

	/*/
	Casset::js('min/new.min.js');
	//*/
	echo Casset::render_js();
?>
</body>
</html>