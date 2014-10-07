<?php

class Controller_Ranking extends Controller_Rest
{
	public function action_index()
	{
		$view = View::forge('home/ranking');
		$view->set_global('user_info', Session::get('user_info'));
		$view->head = View::forge('head');
		$view->header = View::forge('header');
		$view->footer = View::forge('footer');
		$view->lang_list = View::forge('lang_list');

		return Response::forge(Model_Html::minify($view, Uri::current()));
	}

	// ランキングリスト取得
	public function post_list($lang, $id)
	{
		$code_id = $lang.'/'.$id;
		$list = Model_Ranking::get_list($code_id);

		return $this->response(array(
			'list' => $list
		));
	}

	public function post_totalranking($lang)
	{
		$list = Model_Ranking::get_total_ranking($lang);
		return $this->response(array(
			'list' => $list
		));
	}

	public function post_rank($lang, $id)
	{
		$code_id = $lang.'/'.$id;
		$user_id = Session::get('user_info.id');
		$total_score = Input::post('total_score');
		$total_time = Input::post('total_time');
		$type_speed = Input::post('type_speed');
		$type_chars = Input::post('type_chars');
		$miss_rate = Input::post('miss_rate');
		$max_combo = Input::post('max_combo');
		$wpm = Input::post('wpm');
		$epm = Input::post('epm');
		$line_num = Input::post('line_num');

		// プレイ履歴に追加
		Model_History::insert_history(array(
			'code_id' => $code_id,
			'user_id' => $user_id,
			'total_score' => $total_score,
			'total_time' => $total_time,
			'miss_rate' => $miss_rate,
			'type_speed' => $type_speed,
			'max_combo' => $max_combo,
			'wpm' => $wpm,
			'epm' => $epm,
			'line_num' => $line_num,
			'date' => date('Y-m-d H:i:s')
		), 'play');

		if (!$user_id)
		{
			// ゲスト
			return $this->response(array(
				'Error' => true
			));
		}

		// ユーザーのタイプミス情報を更新
		Model_User::update_type_chars($user_id, json_decode($type_chars, true));

		// 順位を取得
		$rank = Model_Ranking::get_rank($code_id, $user_id, $total_score);

		return $this->response(array(
			'Error' => false,
			'rank' => $rank
		));
	}

	public function post_register()
	{
		$user_id = Session::get('user_info.id');

		if (!$user_id)
		{
			return $this->response(array(
				'Error' => true
			));
		}

		$prev_total_score = self::get_rating_from_user_id($user_id);

		Model_Ranking::register(array(
			'code_id' => Input::post('code_id'),
			'user_id' => $user_id,
			'total_score' => Input::post('total_score'),
			'total_time' => Input::post('total_time'),
			'miss_rate' => Input::post('miss_rate'),
			'type_speed' => Input::post('type_speed'),
			'max_combo' => Input::post('max_combo'),
			'date' => date('Y-m-d H:i:s')
		));

		$next_total_score = self::get_rating_from_user_id($user_id);

		return $this->response(array(
			'Error' => false,
			'diff' => $next_total_score - $prev_total_score
		));
	}

	private static function get_rating_from_user_id($user_id)
	{
		$rating = Model_Ranking::get_total_ranking('all', $user_id);
		return 0 === count($rating) ? 0 : $rating[0]['rating'];
	}
}
