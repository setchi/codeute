<?php

class Controller_Email extends Controller_Rest
{
	public function post_send()
	{
		Package::load('email');

		$user_id = Session::get('user_info.id');
		$subject = '不具合報告・ご要望 from: '.$user_id;
		$body = Input::post('body');

		Model_Email::post_message(array(
			'f_user_id' => $user_id,
			'f_date' => date('Y-m-d H:i:s'),
			'f_message' => $body
		));

		$email = Email::forge('jis');
		$email->from('admin@codeute.com', 'codeute.com');
		$email->to('ri_xer@yahoo.co.jp');
		$email->subject($subject);
		$email->body(mb_convert_encoding($body, 'jis'));

		$err_msg = '送信が完了しました。';

		if (!$body) {
			return $this->response(array(
				'error' => 'no message'
			));
		}

		try {
		    $email->send();
		}
		catch (\EmailValidationFailedException $e) {
		    $err_msg = '送信に失敗しました。';
		}
		catch (\EmailSendingFailedException $e) {
		    $err_msg = '送信に失敗しました。';
		}

		$this->response(array(
			'msg' => $err_msg
		));
	}
}
