<?php

class Controller_Code extends Controller_Rest
{
	public function action_index()
	{
		return Response::redirect('/');
	}

	// ログインしていない場合は表示を切り替える
	public function post_getcode($lang, $id)
	{
		$code_id = $lang.'/'.$id;
		$user_id = Session::get('user_info.id');
		$code_data = Model_Code::get_code_info($code_id);

		// エラー
		if (!$code_data || $code_data['open'] == 'private' && $code_data['user_id'] != $user_id)
		{
			return $this->response(array(
				'Error' => true
			));
		}
		else
		{
			return $this->response(array(
				'Error' => false,
				'editor_theme' => $code_data['editor_theme'],
				'code' => $code_data['code'],
				'font_size' => $code_data['font_size'],
				'code_language' => $code_data['code_language'],
				'tip_color' => $code_data['tip_color']
			));
		}
	}

	public function post_status($lang, $id)
	{
		$code_id = $lang.'/'.$id;
		$user_id = Session::get('user_info.id');
		$code_data = Model_Code::get_code_info($code_id);

		// エラー
		if (!$code_data || $code_data['open'] == 'private' && $code_data['user_id'] != $user_id)
		{
			return $this->response(array(
				'Error' => true
			));
		}
		else
		{
			return $this->response(array(
				'Error' => false,
				'view_num' => $code_data['view_num'],
				'play_num' => $code_data['play_num'],
				'favorited_num' => $code_data['favorited_num']
			));
		}
	}

	public function post_favorite($lang, $id, $favorite) {

		$user_id = Session::get('user_info.id');

		if (!$user_id) {
			return $this->response(array(
				'Error' => true
			));
		}

		Model_Favorite::set_favorite($lang, $id, $user_id, $favorite);

		return $this->response(array(
			'Error' => false,
			'res' => $favorite
		));
	}
}
