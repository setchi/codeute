<?php

class Model_Ranking extends Model
{
	private static $to_db_fmt = array(
	    'code_id' => 'f_code_id',
	    'user_id' => 'f_user_id',
	    'user_name' => 'f_user_nickname',
	    'total_score' => 'f_total_score',

	    'rating' => 'f_rating',

	    'total_time' => 'f_total_time',
	    'miss_rate' => 'f_miss_rate',
	    'type_speed' => 'f_type_speed',
	    'max_combo' => 'f_max_combo',
	    'line_num' => 'f_line_num',
	    'date' => 'f_register_date',
	);

	private static $to_user_fmt = array(
	    'f_code_id' => 'code_id',
	    'f_user_id' => 'user_id',

	    'f_rank' => 'rank',
	    // 'f_avg_rank' => 'avg_rank',
	    // 'f_regist_num' => 'regist_num',
	    'f_rating' => 'rating',

	    'f_user_nickname' => 'user_name',
	    'f_total_score' => 'total_score',
	    'f_total_time' => 'total_time',
	    'f_miss_rate' => 'miss_rate',
	    'f_type_speed' => 'type_speed',
	    'f_max_combo' => 'max_combo',
	    'f_line_num' => 'line_num',
	    'f_register_date' => 'date',
	);

	private static function to_db_data($userfmt_data)
	{
		$res = array();

		foreach ($userfmt_data as $key => $val) {
			$res[self::$to_db_fmt[$key]] = $val; 
		}

		return $res;
	}

	private static function to_user_data($dbfmt_data)
	{
		$res = array();

		foreach ($dbfmt_data as $i => $v) {
			$res[$i] = array();

			foreach ($dbfmt_data[$i] as $key => $val) {
				$res[$i][self::$to_user_fmt[$key]] = $val; 
			}
		}

		return $res;
	}

	// そのコードのランキングリストを取得
	public static function get_list($code_id)
	{
		$query = DB::select(
			DB::expr('(@rank := @rank + 1) AS f_rank'),
			'f_user_nickname',
			'f_total_score',
			'f_type_speed',
			'f_miss_rate',
			'f_register_date'
			
		)->from('v_ranking', DB::expr('(SELECT @rank := 0) AS dmy'))
			->where('f_code_id', $code_id)
			->order_by('f_total_score', 'desc')
			->order_by('f_register_date', 'desc')
			->execute()->as_array();

		$query = self::to_user_data($query);

		return $query;
	}

	public static function get_rank($code_id, $user_id, $total_score)
	{
		// そのユーザーの登録情報取得
		$user_rank_data = DB::select('f_total_score')
			->from('t_ranking')
			->where('f_code_id', $code_id)
			->and_where('f_user_id', $user_id)
			->execute()->as_array();

		// 記録更新していない
		if (count($user_rank_data) > 0 && intval($user_rank_data[0]['f_total_score']) >= intval($total_score))
		{
			return false;
		}
		else // 記録を更新していた場合順位を取得
		{
			$query = DB::select()
				->from('t_ranking')
				->where('f_code_id', $code_id)
				->and_where('f_total_score', '>', $total_score)
				->execute()->as_array();

			return count($query)+1;
		}
	}

	// 記録更新
	public static function register($data)
	{
		$user_rank_data = DB::select()
			->from('t_ranking')
				->where('f_code_id', $data['code_id'])
				->and_where('f_user_id', $data['user_id'])
			->execute()->as_array();

		// 既に登録済みのユーザーの場合
		if (count($user_rank_data) > 0)
		{
			$query = DB::update('t_ranking')
				->set(self::to_db_data($data))
				->where('f_code_id', $data['code_id'])
				->and_where('f_user_id', $data['user_id'])
				->execute();
		}
		else
		{
			$query = DB::insert('t_ranking')
				->set(self::to_db_data($data))
				->execute();
		}
	}


	/* 避難場所

		AVG(t_total_ranking.f_rank) AS f_avg_rank,
		COUNT(t_total_ranking.f_rank) AS f_regist_num,
	*/

	public static function get_total_ranking($lang, $user_id = '') {

		if ($lang === 'all' || !array_key_exists($lang, Model_Code::$nickname))
		{
			$lang = '';
		}
		else
		{
			$lang = ' AND t_code.f_code_language = "'.$lang.'" ';
		}

		if ($user_id) {
			$user_id = ' WHERE t_rating.f_user_id = "'.$user_id.'" ';
		}
		// 偏差値の合計＊平均スコア
		$sql = <<< SQL
SELECT
	(@rank := @rank + 1) AS f_rank,
	t_rating.*
FROM
	(SELECT @rank := 0) AS dmy,
	(
		SELECT
			t_user.f_user_nickname,
			t_user.f_user_id,
			(AVG(t_total.f_total_score) * SQRT(SUM(t_total.f_rank)) * 5) AS f_rating,
			AVG(t_total.f_type_speed) AS f_type_speed,
			AVG(t_total.f_miss_rate ) AS f_miss_rate
		FROM
			(
				SELECT
					t_ranking.*,
					IF(@lang = f_code_id,
						( @rank := @rank +1 ),
						( @rank := 1 )
					) AS f_rank,
					( @lang := f_code_id ) AS f_code_language
				FROM
					(
						SELECT
							t_ranking.*
						FROM
							t_ranking
							JOIN t_code ON t_ranking.f_code_id = t_code.f_code_id AND t_code.f_code_open_flg = 'public' $lang
					) AS t_ranking,
					( SELECT @rank := 0 ) AS rank,
					( SELECT @lang := '' ) AS lang
				ORDER BY
					f_code_id,
					f_total_score ASC
			) AS t_total
			JOIN t_user ON t_total.f_user_id = t_user.f_user_id
		GROUP BY t_total.f_user_id
		ORDER BY f_rating DESC
	) AS t_rating
$user_id
SQL;

		$query = DB::query($sql)->execute()->as_array();

		return self::to_user_data($query);
	}

	private static $sort_field = array(
		'favorited' => 'favorited_num',
		'play' => 'play_num',
		'view' => 'view_num',
		'length' => 'code_length',
		'date' => 'date'
	);

/*
	public static function get_joining_ranking($user_id, $sorting, $offset, $limit)
	{
		$sort = mb_split('_', $sorting);

		if (array_key_exists($sort[0], self::$sort_col) && ($sort[1] == 'desc' || $sort[1] == 'asc'))
		{
			$query = $query->order_by(self::$sort_col[$sort[0]], $sort[1]);

			// 新着に関する並び替えじゃなかった場合だけ、サブ指定を新着順に
			if ($sort[0] != 'date') {
				$query = $query->order_by('f_code_date', 'desc');
			}
		}

		$sql = <<< SQL
			SELECT
				*
			FROM
				(SELECT
					t_total_ranking.f_code_id,
					t_total_ranking.f_user_id,
					t_total_ranking.f_rank,
					t_total_ranking.f_total_score,
					COUNT(t_total_ranking.f_code_id) AS f_regist_num
				FROM
					(
						SELECT
							t_ranking.*,
							IF(@lang = f_code_id,
								( @rank := @rank +1 ),
								( @rank := 1 )
							) AS f_rank,
							( @lang := f_code_id ) AS f_lang
						FROM
							t_ranking,
							( SELECT @rank := 0 ) AS rank,
							( SELECT @lang := '' ) AS lang
						ORDER BY
							f_code_id,
							f_total_score

					) AS t_total_ranking JOIN t_code ON t_total_ranking.f_code_id = t_code.f_code_id AND t_code.f_code_open_flg = 'public'
				WHERE t_total_ranking.f_user_id = 
SQL;
		$sql .= '"'.DB::expr($user_id).'") ORDER BY '.$sorting.' OFFSET '.$offset.' LIMIT '.$limit;

		$query = DB::query($sql)->execute()->as_array();

		return self::to_user_data($query);
	}
	//*/
}
