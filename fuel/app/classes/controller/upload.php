<?php

class Controller_Upload extends Controller_Rest
{
    public function action_index()
    {
        if (!Session::get('user_info')) {
            return Response::redirect('/');
        }
    }

    public function post_updatecode()
    {
        // セッションが無かったらエラー
        if (!Session::get('user_info'))
        {
            return $this->response(array(
                'Error' => 'please login'
            ));
            //return Response::forge('error');
        }

        try {
            $user_id = Session::get('user_info.id');
            // データ受け取り
            $data = json_decode(Input::post('data'));

            // データチェック
            $title_maxlength = 30;
            $description_maxlength = 400;

            if (mb_strlen($data->title) > $title_maxlength ||
                mb_strlen($data->description) > $description_maxlength)
            {
                // タイトルか説明文が長すぎたらエラー
                return $this->response(array(
                    'Error' => true,
                    'message' => 'タイトルか説明文が長すぎます。'
                ));
            }


            $language_change = $data->last_language !== $data->code_language;

            // 言語が変わっていた場合、新規ナンバー取得
            if ($language_change)
            {
                $code_num = Model_Code::get_new_code_num($data->code_language);
            }
            else
            {
                $code_num = $data->last_code_num;
            }

            $update_data = array(
                'code_id' => $data->code_language.'/'.$code_num,
                'code_language' => $data->code_language,
                'code_num' => $code_num,
                'user_id' => $user_id,
                'code' => $data->code,
                'title' => $data->title,
                'description' => $data->description,
                'open' => $data->open,
                'editor_theme' => $data->editor_theme,
                'font_size' => $data->font_size,
                'tip_color' => $data->tip_color,
                'code_length' => $data->code_length,
                'update_date' => date('Y-m-d H:i:s'),
            );

            $last_code = Model_Code::get_code_info($data->last_code_id);
            $last_user_id = $last_code['user_id'];

            if ($last_user_id === $user_id)
            {
                // コードを更新
                Model_Code::update_code($data->last_code_id, $update_data);

                return $this->response(array(
                    'Error' => false,
                    'url' => 'https://codeute.com/'.$update_data['code_language'].'/'.$update_data['code_num'],
                    'open' => $data->open
                ));
            }

        } catch (Exception $e) {
            return $this->response(array(
                'Error' => true,
                'message' => '何らかのエラーが発生しました。'
            ));
        }
    }


    public function post_code()
    {
        // セッションが無かったらエラー
        if (!Session::get('user_info'))
        {
            return $this->response(array(
                'Error' => 'please login'
            ));
            //return Response::forge('error');
        }

        try {
            $user_id = Session::get('user_info.id');
            // データ受け取り
            $data = json_decode(Input::post('data'));

            // データチェック
            $title_maxlength = 30;
            $description_maxlength = 400;

            if (mb_strlen($data->title) > $title_maxlength ||
                mb_strlen($data->description) > $description_maxlength)
            {
                // タイトルか説明文が長すぎたらエラー
                return $this->response(array(
                    'Error' => true,
                    'message' => 'タイトルか説明文が長すぎます。'
                ));
            }

            // ナンバー取得
            $code_num = Model_Code::get_new_code_num($data->code_language);
            $date = date('Y-m-d H:i:s');

            $insert_data = array(
                'code_id' => $data->code_language.'/'.$code_num,
                'code_language' => $data->code_language,
                'code_num' => $code_num,
                'user_id' => $user_id,
                'code' => $data->code,
                'title' => $data->title,
                'description' => $data->description,
                'open' => $data->open,
                'editor_theme' => $data->editor_theme,
                'font_size' => $data->font_size,
                'tip_color' => $data->tip_color,
                'code_length' => $data->code_length,
                'date' => $date,
                'update_date' => $date
            );

            // コードを登録
            Model_Code::register_code($insert_data);

            return $this->response(array(
                'Error' => false,
                'url' => 'https://codeute.com/'.$insert_data['code_language'].'/'.$insert_data['code_num'],
                'open' => $data->open
            ));

        } catch (Exception $e) {
            return $this->response(array(
                'Error' => true,
                'message' => '何らかのエラーが発生しました。'
            ));
        }

        //return DB::select()->from('t_code')->execute()->as_array();
    }
}
