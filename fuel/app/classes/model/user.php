<?php

class Model_User extends Model
{
	private static $to_session_fmt = array(
	    'f_user_id' => 'id',
	    'f_user_num' => 'num',
	    'f_user_name' => 'name',
	    'f_play_history_last_date' => 'play_history_last_date',
	    'f_view_history_last_date' => 'view_history_last_date',
	    'f_type_chars_last_date' => 'type_chars_last_date',
	    'f_user_setting' => 'user_setting',
	    'f_type_chars' => 'type_chars',
	    'f_user_nickname' => 'nickname',
	    'f_user_image' => 'image',
	    'f_last_login' => 'date'
	);

	private static $to_db_fmt = array(
	    'id' => 'f_user_id',
	    'num' => 'f_user_num',
	    'name' => 'f_user_name',
	    'play_history_last_date' => 'f_play_history_last_date',
	    'view_history_last_date' => 'f_view_history_last_date',
	    'type_chars_last_date' => 'f_type_chars_last_date',
	    'user_setting' => 'f_user_setting',
	    'type_chars' => 'f_type_chars',
	    'nickname' => 'f_user_nickname',
	    'image' => 'f_user_image',
	    'date' => 'f_last_login'
	);

	private static function to_db_data($session_data)
	{
		$res = array();

		foreach ($session_data as $key => $val)
		{
			$res[self::$to_db_fmt[$key]] = $val; 
		}

		return $res;
	}

	private static function to_session_data($db_data)
	{
		$res = array();

		foreach ($db_data as $key => $val)
		{
			$res[self::$to_session_fmt[$key]] = $val; 
		}

		return $res;
	}

	public static function get_next_user_num()
	{
		$query = DB::select()
			->from('t_user')
			->order_by('f_user_num', 'desc')
			->limit(1)
			->execute()
			->as_array();

		$res = 0;

		if(count($query) != 0)
		{
			$res = +$query[0]['f_user_num']+1;
		}

		return $res;
	}

	public static function get_user($id, $select = false)
	{
		if ($select)
		{
			$db_select = array();

			foreach ($select as $value)
			{
				$db_select[] = self::$to_db_fmt[$value];
			}
			
			$query = DB::select_array($db_select);
		}
		else
		{
			$query = DB::select();
		}

		$query = $query->from('t_user')
			->where(self::$to_db_fmt['id'], $id)
			->execute()
			->as_array();

		if (count($query) == 0)
		{
			return false;
		}
		else
		{
			return self::to_session_data($query[0]);
		}
	}

	public static function register_user($info)
	{
		$query = DB::insert('t_user')
			->set(self::to_db_data($info))
			->execute();

		return $query;
	}

	public static function update_user($id, $data)
	{
		$query = DB::update('t_user')
			->set(self::to_db_data($data))
			->where(self::$to_db_fmt['id'], $id)
			->execute();

		return $query;
	}

	public static function history_last_date_access($id, $viewplay, $flg)
	{
		if ($flg === 'set')
		{
			$query = DB::update('t_user')
				->value('f_'.$viewplay.'_history_last_date', date('Y-m-d H:i:s'))
				->where(self::$to_db_fmt['id'], $id)
				->execute();

			return $query;
		}
		elseif ($flg === 'get')
		{
			$query = DB::select('f_'.$viewplay.'_history_last_date')
				->from('t_user')
				->where(self::$to_db_fmt['id'], $id)
				->execute()->as_array();

			$res = self::to_session_data($query[0]);
			return $res[$viewplay.'_history_last_date'];
		}
	}

	public static function update_type_chars($id, $type_chars)
	{
		$db_type_chars = DB::select('f_type_chars')
			->from('t_user')
			->where('f_user_id', $id)
			->execute()->as_array();

		if (1 > count($db_type_chars))
		{
			return false;
		}

		$db_type_chars = $db_type_chars[0]['f_type_chars'];
		$db_type_chars = $db_type_chars ? json_decode($db_type_chars, true) : array(
			'correct' => array(),
			'incorrect' => array()
		);

		// マージ
		foreach ($type_chars as $correct => $chars) {

			foreach ($chars as $key => $num) {

				if (array_key_exists($key, $db_type_chars[$correct]))
				{
					$db_type_chars[$correct][$key] += $num;
				}
				else
				{
					$db_type_chars[$correct][$key] = $num;
				}
			}
		}

		$query = DB::update('t_user')
			->value('f_type_chars', json_encode($db_type_chars))
			->where('f_user_id', $id)
			->execute();

		return DB::last_query();
	}

	public static function set_setting($id, $setting)
	{
		$query = DB::select('f_user_setting')
			->from('t_user')
			->where('f_user_id', $id)
			->execute()
			->as_array();

		if (0 < count($query))
		{
			$setting_json = $query[0]['f_user_setting'];
			$setting_json = $setting_json ? json_decode($setting_json, true) : array();


			foreach ($setting as $key => $value) {
				$setting_json[$key] = $value;
			}

			DB::update('t_user')
				->set(array(
					'f_user_setting' => json_encode($setting_json)
				))->execute();
		}
	}

	public static function get_setting($id, $key)
	{
		$res = null;

		$query = DB::select('f_user_setting')
			->from('t_user')
			->where('f_user_id', $id)
			->execute()
			->as_array();

		if (0 < count($query))
		{
			$setting_json = $query[0]['f_user_setting'];
			$setting_json = $setting_json ? json_decode($setting_json, true) : array();

			if (array_key_exists($key, $setting_json))
			{
				$res = $setting_json[$key];
			}
		}

		return $res;
	}
}
