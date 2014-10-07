<?php

class Controller_Mypage extends Controller_Rest
{
	public static $limit, $offset, $sorting, $language, $user_id;
	private static function value_set()
	{
		self::$limit = 50;
		self::$user_id = Session::get('user_info.id');
		self::$offset = Input::get('p', 0) * self::$limit;
		self::$sorting = Input::get('s', 'date_desc');
		self::$language = Input::get('lang', 'all');

		return self::$user_id;
	}

	
	public function action_index()
	{
		$user_info = Session::get('user_info');

		if (!$user_info)
		{
			return Response::redirect('/');
		}

		$view = View::forge('account/mypage');
		$view->set_global('user_info', $user_info);
		$view->head = View::forge('head');
		$view->header = View::forge('header');
		$view->footer = View::forge('footer');

		return Response::forge(Model_Html::minify($view, Uri::current()));
	}


	private static function getlist_history($flg)
	{
		$last_date = Model_User::history_last_date_access(self::$user_id, $flg, 'get');
		$history = Model_History::get_history(self::$user_id, $flg, $last_date, self::$offset, self::$limit);

		$end = count($history) < self::$limit;

		$title_limit = 23;
		$htmlJSON = array();

		foreach($history as $val)
		{
			$title = $val['title'];

			if (mb_strlen($title) > $title_limit)
			{
				$title = mb_substr($title, 0, $title_limit).'…';
			}
			$code_id = mb_split('/', $val['code_id']);

			$htmlJSON[] = array('li', 

					$flg ==='play' ? array('title' => 'スコア: '.$val['total_score'].'<br>速度: '.$val['type_speed'].'/sec<br>ミス: '.$val['miss_rate'].'%<br>コンボ: '.$val['max_combo'].'<br>WPM: '.$val['wpm'].'<br>EPM: '.$val['epm'].'<br>時間: '.$val['total_time'], 'class' => 'added play-'.$val['code_id'])
								   : '',

				array('a', array('href' => $val['code_id'], 'class' => 'tab-button'), array(
					array('div', array(), array(
						array('span', array('class' => 'content'), array(
							array('span','', $title),
							array('span', array('class' => 'lang'), '=>  '.Model_Code::$nickname[$code_id[0]])
						)),
						array('ul', array('class' => 'pull-right unstyled nav nav-pills'), array(
							array('li', array(), array(
								array('span', array('class' => 'pull-right'), $val['date'])
							))
						))
					))
				))
			);
		}

		$htmlJSON = array('div', '', $htmlJSON);

		return array(
			'htmlJSON' => $htmlJSON,
			'end' => $end
		);
	}

	public function get_play()
	{
		if (!self::value_set())
		{
			return $this->response(array('error' => true));
		}

		$res = self::getlist_history('play');

		return $this->response(array(
			'error' => false,
			'html' => $res['htmlJSON'],
			'end' => $res['end']
		));
	}

	public function get_view()
	{
		if (!self::value_set())
		{
			return $this->response(array('error' => true));
		}

		$res = self::getlist_history('view');

		return $this->response(array(
			'error' => false,
			'html' => $res['htmlJSON'],
			'end' => $res['end']
		));
	}

	public function get_favorite()
	{
		if (!self::value_set())
		{
			return $this->response(array(
				'error' => true
			));
		}

		$data = Model_Favorite::get_favorite_list(self::$user_id, self::$language, self::$offset, self::$limit);
		$end = count($data) < self::$limit;

		$title_limit = 23;
		$htmlJSON = array();

		foreach($data as $val)
		{
			$title = $val['title'];

			if (mb_strlen($title) > $title_limit)
			{
				$title = mb_substr($title, 0, $title_limit).'…';
			}
			$code_id = mb_split('/', $val['code_id']);

			$htmlJSON[] = array('li', array('class' => 'added favorite-'.$val['code_id']),
				array('a', array('href' => $val['code_id'], 'class' => 'tab-button'), array(
					array('div', array(), array(
						array('span', array('class' => 'content'), array(
							array('span','', $title),
							array('span', array('class' => 'lang'), '=>  '.Model_Code::$nickname[$code_id[0]])
						))
					)),
					array('ul', array('class' => 'pull-right unstyled nav nav-pills'), array(
						array('li', array('class' => 'remove', 'data-code-id' => $val['code_id'], 'data-flg' => 'favorite'), array(
							array('i', array('class' => 'icon-white icon-trash')),
							array('span', '', '&nbsp;削除')
						))
					))
				))
			);
		}

		$htmlJSON = array('div', '', $htmlJSON);

		return $this->response(array(
			'error' => false,
			'html' => $htmlJSON,
			'end' => $end
		));
	}


	public function get_upload()
	{
		if (!self::value_set())
		{
			return $this->response(array(
				'error' => true
			));
		}

		$code_data = Model_Code::get_upload_code(
			self::$user_id,
			self::$language,
			self::$sorting,
			self::$offset,
			self::$limit
		);

		$code_info = $code_data[0];
		$end = count($code_info) < self::$limit;

		$title_limit = 23;
		$htmlJSON = array();

		function createTipContent($name, $field, $val)
		{
			$res = '';

			foreach ($name as $key => $column) {

				$value = $val[$field[$key]];

				if ($key === 'date')
				{
					$value = mb_substr($value, 0, 10);
				}

				$res .= $column.': '.$value.'<br>';
			}

			return $res;
		}

		foreach($code_info as $val)
		{
			$title = $val['title'];

			if (mb_strlen($title) > $title_limit)
			{
				$title = mb_substr($title, 0, $title_limit).'…';
			}
			$code_id = mb_split('/', $val['code_id']);

			$htmlJSON[] = array('li', array('title' => createTipContent($code_data[1], $code_data[2], $val), 'class' => 'added upload-'.$val['code_id']), 
				array('a', array('href' => $val['code_id'], 'class' => 'tab-button'), array(
					array('div', array(), array(
						array('span', array('class' => 'content'), array(
							array('span','', $title),
							array('span', array('class' => 'lang'), '=>  '.Model_Code::$nickname[$code_id[0]])
						))
					)),
					array('ul', array('class' => 'pull-right unstyled nav nav-pills'), array(
						array('li', '', array('a', array('href' => 'edit/'.$val['code_id']), array(
							array('i', array('class' => 'icon-white icon-pencil')),
							array('span', '', '&nbsp;編集')
						))),
						array('li', array('class' => 'remove', 'data-code-id' => $val['code_id'], 'data-flg' => 'upload'), array(
							array('i', array('class' => 'icon-white icon-trash')),
							array('span', '', '&nbsp;削除')
						))
					))
				))
			);
		}

		$htmlJSON = array('div', '', $htmlJSON);

		return $this->response(array(
			'error' => false,
			'html' => $htmlJSON,
			'end' => $end
		));
	}
/*
	public function get_ranking()
	{

		if (!self::value_set())
		{
			return $this->response(array(
				'error' => true
			));
		}

		$ranking_data = Model_Ranking::get_joining_ranking(
			self::$user_id,
			self::$sorting,
			self::$offset,
			self::$limit
		);

		$ranking_info = $ranking_data[0];
		$end = count($ranking_info) < self::$limit;

		$title_limit = 23;
		$htmlJSON = array();

		foreach($code_info as $val)
		{
			$title = $val['title'];

			if (mb_strlen($title) > $title_limit)
			{
				$title = mb_substr($title, 0, $title_limit).'…';
			}
			$code_id = mb_split('/', $val['code_id']);

			$htmlJSON[] = array('li', array('title' => createTipContent($code_data[1], $code_data[2], $val), 'class' => 'added upload-'.$val['code_id']), 
				array('a', array('href' => $val['code_id'], 'class' => 'tab-button'), array(
					array('div', array(), array(
						array('span', array('class' => 'content'), array(
							array('span','', $title),
							array('span', array('class' => 'lang'), '=>  '.Model_Code::$nickname[$code_id[0]])
						))
					)),
					array('ul', array('class' => 'pull-right unstyled nav nav-pills'), array(
						array('li', '', array('a', array('href' => 'edit/'.$val['code_id']), array(
							array('i', array('class' => 'icon-white icon-pencil')),
							array('span', '', '&nbsp;編集')
						))),
						array('li', array('class' => 'remove', 'data-code-id' => $val['code_id'], 'data-flg' => 'upload'), array(
							array('i', array('class' => 'icon-white icon-trash')),
							array('span', '', '&nbsp;削除')
						))
					))
				))
			);
		}

		return $this->response(array(
			'error' => false,
			'html' => $htmlJSON,
			'end' => $end
		));
	}
//*/
	public function post_remove($flg)
	{
		$user_id = Session::get('user_info.id');
		$code_id = Input::post('code_id', false);

		if (!$user_id || !$code_id)
		{
			return $this->response(array('error' => true));
		}

		if ($flg ==='upload')
		{
			Model_Code::remove_code($code_id, $user_id);
		}
		elseif ($flg === 'favorite')
		{
			$code_id = mb_split('/', $code_id);
			Model_Favorite::set_favorite($code_id[0], $code_id[1], $user_id, 'false');
		}

		return $this->response(array('error' => false));
	}


	public function post_removehistory($flg)
	{
		if (!self::value_set())
		{
			return $this->response(array('error' => true));
		}

		Model_User::history_last_date_access(self::$user_id, $flg, 'set');

		return $this->response(array(
			'error' => false
		));
	}
	

	public function post_nickname()
	{
		$user_id = Session::get('user_info.id');

		if (!$user_id) {
			return Response::redirect('/');
		}

		$nickname = Input::post('nickname');

		Model_User::update_user($user_id, array('nickname' => $nickname));

		Session::set('user_info.nickname', $nickname);

		return $this->response(array(
			'nickname' => $nickname
		));
	}
}
