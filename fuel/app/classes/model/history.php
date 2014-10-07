<?php

class Model_History extends Model
{
	private static $to_db_fmt = array(
		'code_id' => 'f_code_id',
		'user_id' => 'f_user_id',
		'title' => 'f_code_title',
		'view_num' => 'f_code_view_num',
		'play_num' => 'f_code_play_num',
		'date' => 'f_date',
		'total_score' => 'f_total_score',
		'total_time' => 'f_total_time',
		'miss_rate' => 'f_miss_rate',
		'type_speed' => 'f_type_speed',
		'max_combo' => 'f_max_combo',
		'wpm' => 'f_wpm',
		'epm' => 'f_epm',
		'line_num' => 'f_line_num'
	);

	private static $to_user_fmt = array(
		'f_code_id' => 'code_id',
		'f_user_id' => 'user_id',
		'f_code_title' => 'title',
		'f_code_view_num' => 'view_num',
		'f_code_play_num' => 'play_num',
		'f_date' => 'date',
		'f_total_score' => 'total_score',
		'f_total_time' => 'total_time',
		'f_miss_rate' => 'miss_rate',
		'f_type_speed' => 'type_speed',
		'f_max_combo' => 'max_combo',
		'f_wpm' => 'wpm',
		'f_epm' => 'epm',
		'f_line_num' => 'line_num'
	);

	private static function to_db_data($userfmt_data)
	{
		$res = array();

		foreach ($userfmt_data as $key => $val)
		{
			$res[self::$to_db_fmt[$key]] = $val; 
		}
		return $res;
	}

	private static function to_user_data($dbfmt_data)
	{
		$res = array();

		foreach ($dbfmt_data as $i => $v)
		{
			$res[$i] = array();

			foreach ($dbfmt_data[$i] as $key => $val)
			{
				$res[$i][self::$to_user_fmt[$key]] = $val; 
			}
		}
		return $res;
	}

	public static function insert_history($history, $flg)
	{
		DB::update('t_code')
			->value('f_code_'.$flg.'_num', DB::expr('f_code_'.$flg.'_num + 1'))
			->where('f_code_id', $history['code_id'])
			->execute();

		DB::insert('t_code_'.$flg.'_history')
			->set(self::to_db_data($history))
			->execute();

		return DB::last_query();
	}

	public static function get_history($user_id, $flg, $last_date, $offset, $limit)
	{
		$query = DB::select()
			->from('v_code_'.$flg.'_history')
			->where('f_user_id', $user_id)
			->and_where('f_date', '>', $last_date)
			->order_by('f_date', 'desc')
			->offset($offset)->limit($limit)
			->execute()->as_array();

		$res = self::to_user_data($query);

		return $res;
	}
}
