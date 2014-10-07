<?php

class Controller_Auth extends Controller
{
    private $_config = null;

    public function before()
    {
        if(!isset($this->_config))
        {
            $this->_config = Config::load('opauth', 'opauth');
        }
    }

    /**
     * eg. http://www.exemple.org/auth/login/facebook/ will call the facebook opauth strategy.
     * Check if $provider is a supported strategy.
     */
    public function action_login($_provider = null)
    {
        if(array_key_exists(Inflector::humanize($_provider), Arr::get($this->_config, 'Strategy')))
        {
            $_oauth = new Opauth($this->_config, true);
        }
        else
        {
            return Response::forge('Strategy not supported');
        }
    }

    public function action_logout($_provider = null)
    {
        return Response::redirect('/logout');
    }

    // Print the user credentials after the authentication. Use this information as you need. (Log in, registrer, ...)
    public function action_callback()
    {
        $_opauth = new Opauth($this->_config, false);

        switch($_opauth->env['callback_transport'])
        {
            case 'session':
                session_start();
                $response = $_SESSION['opauth'];
                unset($_SESSION['opauth']);
            break;            
        }

        if (array_key_exists('error', $response))
        {
        	return Response::redirect('/');
            echo '<strong style="color: red;">Authentication error: </strong> Opauth returns error auth response.'."<br>\n";
        }
        else
        {
            if (empty($response['auth']) || empty($response['timestamp']) || empty($response['signature']) || empty($response['auth']['provider']) || empty($response['auth']['uid']))
            {
        		return Response::redirect('/');
                echo '<strong style="color: red;">Invalid auth response: </strong>Missing key auth response components.'."<br>\n";
            }
            elseif (!$_opauth->validate(sha1(print_r($response['auth'], true)), $response['timestamp'], $response['signature'], $reason))
            {
        		return Response::redirect('/');
                echo '<strong style="color: red;">Invalid auth response: </strong>'.$reason.".<br>\n";
            }
            else
            {
                // echo '<strong style="color: green;">OK: </strong>Auth response is validated.'."<br>\n";

                // デバッグ用
                // Session::set('user_all_info', $response);

                $auth = $response['auth'];
                $user_id = $auth['provider'].'_'.$auth['uid'];

                $user_data = Model_User::get_user($user_id);

                // ニックネーム取得 (name, nickname　どっちかが欠けてる場合がある)
                if (array_key_exists('nickname', $auth['info']))
                {
                	$nickname = $auth['info']['nickname'];
                }
                else if (array_key_exists('name', $auth['info']))
                {
                	$nickname = $auth['info']['name'];
                }
                else
                {
                	$nickname = 'anonymous';
                }

                $img = file_get_contents($auth['info']['image']);//画像を取得

                $img_fullpath = 'assets/img/user/'.$user_id.'.jpg';//画像の保存フルパス
                file_put_contents(DOCROOT.$img_fullpath, $img);//保存

                $img_fullpath = '/'.$img_fullpath;

                // 初めてのユーザー
                if ($user_data === false)
                {
                    $date = date('Y-m-d H:i:s');
                    $user_num = Model_User::get_next_user_num();

                    $auth_user_info = array(
                        'id' => $user_id,
                        'num' => $user_num,
                        'name' => $nickname,
                        'nickname' => $nickname,
                        'image' => $img_fullpath,
                        'date' => $date,
                        'type_chars_last_date' => $date
                    );

                    Model_User::register_user($auth_user_info);
                    Session::set('new_user', true);
                }
                else // 2回目以降
                {
                    $auth_user_info = array(
                        'name' => $nickname,
                        'image' => $img_fullpath,
                        'date' => date('Y-m-d H:i:s')
                    );

                    Model_User::update_user($user_id, $auth_user_info);
                    Session::delete('new_user');
                }

                // セッション用データ取得
                $user_data = Model_User::get_user($user_id, array(
                    'id',
                    'num',
                    'name',
                    'image',
                    'nickname'
                ));

                Session::set('user_info', $user_data);

                // 新規ユーザー
                if (Session::get('new_user') == true)
                {
                    return Response::redirect('/new-user');
                }
                else // 新規でない
                {
                    return Response::redirect('/login');
                }

                /**
                 * It's all good. Go ahead with your application-specific authentication logic
                 */
            }
        }

        return Response::forge(var_dump($response));
    }
}
