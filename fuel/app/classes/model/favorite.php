<?php

class Model_Favorite extends Model
{
	public static function set_favorite($lang, $num, $user_id, $favorite)
	{
		if ($favorite == 'true')
		{
			$query = DB::insert('t_code_favorite')
				->set(array(
					'f_code_id' => $lang.'/'.$num,
					'f_user_id' => $user_id,
					'f_date' => date('Y-m-d H:i:s')
				))->execute();
		}
		else
		{
			$query = DB::delete('t_code_favorite')
				->where('f_code_id', $lang.'/'.$num)
				->and_where('f_user_id', $user_id)
				->execute();
		}

		return $query;
	}

	public static function get_favorite($lang, $num, $user_id)
	{
		$query = DB::select()
			->from('t_code_favorite')
			->where('f_code_id', $lang.'/'.$num)
			->and_where('f_user_id', $user_id)
			->execute()->as_array();

		$res = 0 < count($query);

		return $res;
	}

	public static function get_favorite_list($user_id, $language, $offset, $limit)
	{
		// クエリ発行
		$query = DB::select(
			'v_code.*',
			't_total.f_rank'

		)->from('v_code')

		->join(DB::expr(Model_Code::$t_total), 'left')->on(
			DB::expr('t_total.f_code_id = v_code.f_code_id'),
			'AND',
			DB::expr('t_total.f_user_id = "'.$user_id.'"')
			
		)->join('t_code_favorite')
			->on('v_code.f_code_id', '=', 't_code_favorite.f_code_id')
		->where('t_code_favorite.f_user_id', $user_id);

		// 言語検索
		if ($language !== 'all')
		{
			$query = $query->and_where('v_code.f_code_language', $language);
		}
		
		$query = $query->order_by('t_code_favorite.f_date', 'desc')
		->limit($limit)
		->offset($offset)
		->execute()
		->as_array();

		$res = Model_Code::to_user_data($query);

		return $res;
	}
}
