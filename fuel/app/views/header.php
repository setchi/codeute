<?php
  $root_path = '//localhost:8087/codeute';
  $root_path = '';
?>
<div id="fb-root"></div>
<header class="navbar">
  <div class="navbar-inner">
    <div class="container" style="width: auto;">
    <!--
      <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-white icon-bar"></span>
        <span class="icon-white icon-bar"></span>
        <span class="icon-white icon-bar"></span>
      </a>
    -->
      <a class="brand header-logo audiowide" title="トップページに移動" href="<?php echo $root_path; ?>/">Codeute! {β}</a>

      <div class="nav-collapse">
        <ul class="nav">
          <li class="divider-vertical"></li>
        </ul>
        <form class="navbar-search" method="get" action="<?php echo $root_path; ?>/search">
          <div class="input-append">
            <input type="search" name="q" placeholder="コードを検索"><button class="btn btn-primary" type="submit"><i class="icon-search icon-white"></i></button>
          </div>
        </form>
        <ul class="nav">
          <li class="divider-vertical"></li>
          <li><a href="<?php echo $root_path; ?>/ranking">総合ランキング</a></li>
        </ul>
      </div>

<?php
  if (!$user_info) { // ログアウト中
?>
      <div class="nav-collapse">
        <ul class="nav">
        </ul>
        <ul class="nav pull-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">ログイン <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="<?php echo $root_path; ?>/auth/login/facebook" class="sns-login"><span class="login-btn-facebook menu-sns-icon"></span><span class="menu-sns">Facebook</span></a></li>
              <li><a href="<?php echo $root_path; ?>/auth/login/twitter" class="sns-login"><span class="login-btn-twitter menu-sns-icon"></span><span class="menu-sns">Twitter</span></a></li>
              <li><a href="<?php echo $root_path; ?>/auth/login/github" class="sns-login"><span class="login-btn-github menu-sns-icon"></span><span class="menu-sns">GitHub</span></a></li>
              <li class="divider"></li>
              <li><a data-toggle="modal" href="#email">不具合報告・ご要望</a></li>
            </ul>
          </li>
        </ul>
      </div>

<?php
  } else { // ログイン中
?>

      <div class="nav-collapse">
        <ul class="nav pull-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <img class="my-image" src="<?php echo $user_info['image'] ?>">
              <span class="user_info_nickname"><?php echo $user_info['nickname'] ?></span>
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li class="nav-header">アカウント</li>
              <li><a href="<?php echo $root_path; ?>/mypage"><i class="icon-white icon-inbox"></i> マイページ</a></li>
              <li><a href="<?php echo $root_path; ?>/new"><i class="icon-white icon-pencil"></i> 新規作成</a></li>
              <li class="divider"></li>
              <li><a href="<?php echo $root_path; ?>/auth/logout">ログアウト</a></li>
              <li><a data-toggle="modal" href="#email">不具合報告・ご要望</a></li>
            </ul>
          </li>
        </ul>
      </div>
<?php
  }
?>
      <!-- email -->
      <div class="modal hide fade" id="email" data-element="modal">
        <div class="modal-header">
          <a class="close" data-dismiss="modal">&times;</a>
          <h3 class="page-header">不具合報告・ご要望</h3>
        </div>
        <div class="modal-body panel1">
            <form class="form-nickname" method="post" action="/">
              <textarea required placeholder="不具合の報告や、ご意見・ご要望をお聞かせください"></textarea>
            </form>
        </div>
        <div class="modal-body panel2"></div>
        <div class="modal-footer">
          <div class="btn btn-primary send">送信</div>
          <a href="#" class="btn" data-dismiss="modal">閉じる</a>
        </div>
      </div>

    </div>
  </div>
</header>