<?php

class Controller_Home extends Controller
{
	/*
	private static $session;
	public function before() {
    	self::$user_info = Session::get('user_info', false);
	}
	*/

	private static $user_info;
	public function before()
	{
		self::$user_info = Session::get('user_info');
	}

	private static function view($path, $user_info)
	{
		$view = View::forge($path);
		$view->set_global('user_info', $user_info);
		$view->head = View::forge('head');
		$view->header = View::forge('header');
		$view->footer = View::forge('footer');

		return $view;
	}

    public function action_index()
    {
		$view = self::view('home/index', self::$user_info);

		if (self::$user_info)
		{
			$view->lang_list = View::forge('lang_list');
		}

        return Response::forge(Model_Html::minify($view, Uri::current()));
    }

	public function action_login()
	{
		$view = self::view('home/index', self::$user_info);

		if (self::$user_info)
		{
			$view->lang_list = View::forge('lang_list');
		}

		return Response::forge(Model_Html::minify($view, Uri::current()));
	}

    public function action_logout()
    {
        // セッションを削除して、/にリダイレクト
        Session::delete('user_info');
		return Response::forge(Model_Html::minify(self::view('home/index', false), Uri::current()));
    }

    public function action_newuser()
    {
    	if(!self::$user_info || !Session::get('new_user'))
    	{
    		return Response::redirect('/');
    	}

		$view = self::view('home/newuser', self::$user_info);

        return Response::forge(Model_Html::minify($view, Uri::current()));
    }

	// ログインしていない場合は表示を切り替える
	public function action_typing($lang, $num)
	{
		$code_id = $lang.'/'.$num;
		$user_id = self::$user_info ? self::$user_info['id'] : null;
		$code_data = Model_Code::get_code_info($code_id, $user_id);

		// コードが存在しない || 非公開
		if (!$code_data || $code_data['open'] == 'private' && $code_data['user_id'] != $user_id)
		{
			$view = self::view('home/code-404', self::$user_info);
		}
		else
		{
			$view_history_data = array(
				'code_id' => $code_id,
				'user_id' => self::$user_info['id'],
				'date' => date('Y-m-d H:i:s')
			);
			Model_History::insert_history($view_history_data, 'view');

			$view = self::view('home/typing', self::$user_info);
			$view->set_global('code_data', $code_data);
			$view->keyboard = View::forge('keyboard');
		}
		
		return Response::forge(Model_Html::minify($view, Uri::current()));
	}

	public function action_new()
	{
		$view = self::view('home/new', self::$user_info);

		$last_session = self::$user_info ? Model_Code::get_last_upload_session(self::$user_info) : false;

		$view->last_session = $last_session;
		$view->lang_list = View::forge('lang_list');

		return Response::forge(Model_Html::minify($view, Uri::current()));
	}

	public function action_edit($lang, $code_id)
	{
		$code_data = Model_Code::get_code_info($lang.'/'.$code_id);

		if (!self::$user_info || !$code_data || $code_data['user_id'] !== self::$user_info['id'])
		{
			$view = self::view('home/code-404', self::$user_info);
		}
		else
		{
			$view = self::view('home/edit', self::$user_info);
			$view->code_data = $code_data;
			$view->lang_list = View::forge('lang_list');
		}

		return Response::forge(Model_Html::minify($view, Uri::current()));
	}

	public function action_about()
	{
		$view = self::view('home/about', self::$user_info);
		return Response::forge(Model_Html::minify($view, Uri::current()));
	}

	public function action_404()
	{
		$view = self::view('home/404', self::$user_info);
		return Response::forge(Model_Html::minify($view, Uri::current()), 404);
	}
}
