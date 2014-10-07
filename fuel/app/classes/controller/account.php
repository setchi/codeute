<?php

class Controller_Account extends Controller_Rest
{

	public function action_index()
	{
		return Response::redirect('/');
	}

	public function action_newuser()
	{
		if (!Session::get('user_info', false) || !Session::get('new_user'))
		{
			return Response::redirect('/');
		}

		$update_data = array(
			'nickname' => Input::post('nickname')
		);

		$user_info = Session::get('user_info');
		$user_id = $user_info['id'];

		// ニックネームを更新
		Model_User::update_user($user_id, $update_data);
		// セッションを更新
		Session::set('user_info', Model_User::get_user($user_id));
		// セッション：new_userを削除
		Session::delete('new_user');
		
		return Response::redirect('/login');
	}

	public function post_setting($get)
	{
		$user_id = Session::get('user_info.id', false);
		$data = Input::post('data');

		if (!$user_id) {
			return $this->response(array(
				'Error' => 0
			));
		}

		if ($get === 'get') // get
		{
			$value = Model_User::get_setting($user_id, $data);
			return $this->response(array(
				'Error' => false,
				'value' => $value
			));
		}
		else // set
		{
			$value = Model_User::set_setting($user_id, $data);

			return $this->response(array(
				'Error' => false
			));
		}		
	}
}
