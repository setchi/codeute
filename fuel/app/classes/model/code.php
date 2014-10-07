<?php
require_once APPPATH.'classes/model/lib/tiny_segmenter.php';

class Model_Code extends Model
{
	public static $nickname = array(
		'abap' => 'ABAP',
		'actionscript' => 'ActionScript',
		'c' => 'C',
		'cpp' => 'C++',
		'cobol' => 'COBOL',
		'coffee' => 'CoffeeScript',
		'csharp' => 'C#',
		'css' => 'CSS',
		'clojure' => 'Clojure',
		'd' => 'D',
		'dart' => 'Dart',
		'erlang' => 'Erlang',
		'forth' => 'Forth',
		'golang' => 'Go',
		'groovy' => 'Groovy',
		'haskell' => 'Haskell',
		'haxe' => 'Haxe',
		'html' => 'HTML',
		'java' => 'Java',
		'javascript' => 'JavaScript',
		'jsx' => 'JSX',
		'lisp' => 'Lisp',
		'lsl' => 'LSL',
		'lua' => 'Lua',
		'matlab' => 'MATLAB',
		'mysql' => 'MySQL',
		'objectivec' => 'Objective-C',
		'ocaml' => 'OCaml',
		'pascal' => 'Pascal',
		'perl' => 'Perl',
		'php' => 'PHP',
		'prolog' => 'Prolog',
		'python' => 'Python',
		'r' => 'R',
		'ruby' => 'Ruby',
		'rust' => 'Rust',
		'scala' => 'Scala',
		'scheme' => 'Scheme',
		'sh' => 'ShellScript',
		'typescript' => 'TypeScript',
		'vbscript' => 'VBScript',
		'verilog' => 'Verilog',
		'assembly_x86' => 'x86 Assembly',
		'xml' => 'XML',
		'xquery' => 'XQuery'
	);

	public static function get_code_nickname($name)
	{
		return self::$nickname[$name];
	}

	private static $to_db_fmt = array(
	    'code_id' => 'f_code_id',
	    'code_language' => 'f_code_language',
	    'code_num' => 'f_code_num',

	    'play_num' => 'f_code_play_num',
	    'view_num' => 'f_code_view_num',
	    'favorited_num' => 'f_code_favorited_num',
	    'ranking_regist_num' => 'f_ranking_regist_num',

	    'favorited' => 'f_favorited',
	    'user_id' => 'f_user_id',
	    'nickname' => 'f_user_nickname',
	    'code' => 'f_code_value',
	    'title' => 'f_code_title',
	    'open' => 'f_code_open_flg',
	    'description' => 'f_code_description',
	    'fulltext' => 'f_code_search',
	    'editor_theme' => 'f_code_editor_theme',
	    'font_size' => 'f_code_font_size',
	    'tip_color' => 'f_code_tip_color',
	    'code_length' => 'f_code_length',
	    'date' => 'f_code_date',
	    'update_date' => 'f_code_last_update_date'
	);

	private static $to_user_fmt = array(
	    'f_code_id' => 'code_id',
	    'f_code_language' => 'code_language',
	    'f_code_num' => 'code_num',

	    'f_code_play_num' => 'play_num',
	    'f_code_view_num' => 'view_num',
	    'f_code_favorited_num' => 'favorited_num',
	    'f_ranking_regist_num' => 'ranking_regist_num',
	    'f_rank' => 'rank',

	    'f_favorited' => 'favorited',
	    'f_user_id' => 'user_id',
	    'f_user_nickname' => 'nickname',
	    'f_code_value' => 'code',
	    'f_code_title' => 'title',
	    'f_code_open_flg' => 'open',
	    'f_code_description' => 'description',
	    'f_code_search' => 'fulltext',
	    'f_code_editor_theme' => 'editor_theme',
	    'f_code_font_size' => 'font_size',
	    'f_code_tip_color' => 'tip_color',
	    'f_code_length' => 'code_length',
	    'f_code_date' => 'date',
	    'f_code_last_update_date' => 'update_date'
	);

	private static $sort_col = array(
		'date' => 'f_code_date',
		'play' => 'f_code_play_num',
		'view' => 'f_code_view_num',
		'ranking' => 'f_ranking_regist_num',
		'length' => 'f_code_length'
	);

	private static $sort_name = array(
		'favorited' => 'お気に入り',
		'ranking' => 'ランク参加者',
		'play' => 'プレイ数',
		'view' => '閲覧数',
		'length' => '入力文字',
		'date' => '投稿日'
	);

	private static $sort_field = array(
		'favorited' => 'favorited_num',
		'ranking' => 'ranking_regist_num',
		'play' => 'play_num',
		'view' => 'view_num',
		'length' => 'code_length',
		'date' => 'date'
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

	public static function to_user_data($dbfmt_data)
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

	private static function to_ngram($str)
	{
		$res = "";

		for ($i = 0, $len = mb_strlen($str); $i < $len; $i+=2)
		{
			$res .= mb_substr($str, $i, 2).' '.mb_substr($str, $i+1, 2).' ';
		}

		return $res;
	}

	private static function to_tiny_segment($arr)
	{
		// 形態素解析
		$segmenter = new TinySegmenterarray();
		$res = '';

		foreach ($arr as $key => $value) {
			$res .= " ".join(" ", $segmenter->segment($value))." ";
		}

		return $res;
	}


	// 新規登録用のcode_idを取得
	public static function get_new_code_num($lang)
	{
		$query = DB::select('f_code_num')
			->from('t_code')
			->where('f_code_language', $lang)
			->order_by('f_code_num', 'desc')
			->limit(1)
			->execute()
			->as_array();

		$res = 0;

		if(count($query) != 0)
		{
			$res = +$query[0]['f_code_num']+1;
		}

		return $res;
	}

	// コード登録
	public static function register_code($data)
	{
		// 形態素解析
		$data['fulltext'] = self::to_tiny_segment(array(
			$data['code_language'],
			self::get_code_nickname($data['code_language']),
			$data['title'],
			$data['description']
		));

		$query = DB::insert('t_code')
			->set(self::to_db_data($data))
			->execute();

		return $query;
	}

	// コード情報取得
	public static function get_code_info($code_id, $user_id = '')
	{
		$query = DB::select('v_code.*', DB::expr('COUNT(t_code_favorite.f_user_id) AS f_favorited'))
			->from('v_code')
			->join('t_code_favorite', 'left')
				->on(
					DB::expr('t_code_favorite.f_code_id = "'.$code_id.'"'),
					'AND',
					DB::expr('t_code_favorite.f_user_id = "'.$user_id.'"')
				)
			->where('v_code.f_code_id', $code_id)
			->execute()
			->as_array();

		if (count($query) == 0)
		{
			return false;
		}
		elseif ($query[0]['f_code_id'] === null)
		{
			return false;
		}
		else
		{
			$code_data = self::to_user_data($query);
			return $code_data[0];
		}
	}

	public static function get_last_upload_session($user_info)
	{
		$query = DB::select('f_code_language', 'f_code_editor_theme', 'f_code_font_size', 'f_code_tip_color')
			->from('t_code')
			->where('f_user_id', $user_info['id'])
			->order_by('f_code_date', 'desc')
			->limit(1)
			->execute()->as_array();

		if (count($query))
		{
			$res = self::to_user_data($query);
			$res = $res[0];
			
			$last_session = $res['code_language'].'/'.$res['editor_theme'].'/'.$res['font_size'].'/'.$res['tip_color'];
		}
		else
		{
			$last_session = false;
		}

		return $last_session;
	}

	public static $t_total = <<< SQL
		((
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
						JOIN t_code ON t_ranking.f_code_id = t_code.f_code_id AND t_code.f_code_open_flg = 'public'
				) AS t_ranking,
				( SELECT @rank := 0 ) AS rank,
				( SELECT @lang := '' ) AS lang
			ORDER BY
				f_code_id,
				f_total_score DESC
		) AS t_total)
SQL;

	// 全文検索
	public static function search_code_fulltext($query_str, $language, $sorting, $user_id, $limit, $offset)
	{
		$query_arr = mb_split("[ 　]", $query_str);
		$wakati_arr = array();

		// お気に入りを取得
		if ($sorting == 'favorited')
		{
			$query = Model_Favorite::get_favorite_list($user_id, $language, $offset, $limit);

			return array($query, array(
				'name' => 'お気に入り',
				'field' => false
			), array(), DB::last_query());
		}

		// 形態素解析
		$segmenter = new TinySegmenterarray();

		foreach($query_arr as $val)
		{
			$wakati_arr[] = $segmenter->segment($val);
		}

		// クエリ発行
		$query = DB::select('v_code.*', 't_total.f_rank')
			->from('v_code')
				->join(DB::expr(self::$t_total), 'left')->on(
					DB::expr('t_total.f_code_id = v_code.f_code_id'),
					'AND',
					DB::expr('t_total.f_user_id = "'.$user_id.'"')
			)->where_open();

/*
	// ○近似値による高精度な順位が得られる
	// ○検索が高速らしい
	// ×言語別検索を別途実装しなければいけない
	// ×短すぎるキーワードにヒットしなくなる

		$against_str = "";

		foreach ($wakati_arr as $key => $val) {
			$against_str .= ' +'.DB::quote(join(" ", $val)).' +'.DB::quote($query_arr[$key]);
		}
		//foreach($wakati_arr as $words) {
			$query = $query->and_where(DB::expr('MATCH(f_code_search)'),
		         '', DB::expr('AGAINST("'.$against_str.'")'));
		//}
// */

//*
		foreach($wakati_arr as $words) 
		{
			$query = $query->and_where('f_code_search', 'like', '%'.join("%", $words).'%');
		}
// */
		$query = $query->and_where_open()
			->where('f_code_open_flg', 'public')
			->or_where('f_code_open_flg', 'private')
			->and_where('v_code.f_user_id', $user_id)
		->and_where_close();

		// 言語検索
		if ($language !== 'all')
		{
			$query = $query->and_where('v_code.f_code_language', $language);
		}
		
		$query = $query->where_close();

		// 並べ替え
		// 変な値じゃないかチェック & 変換
		$sort = mb_split('_', $sorting);

		if (array_key_exists($sort[0], self::$sort_col) && ($sort[1] == 'desc' || $sort[1] == 'asc'))
		{
			$query = $query->order_by(self::$sort_col[$sort[0]], $sort[1]);

			// 新着に関する並び替えじゃなかった場合だけ、サブ指定を新着順に
			if ($sort[0] != 'date') {
				$query = $query->order_by('f_code_date', 'desc');
			}
		}

		$query = $query->limit($limit)
			->offset($offset)
			->execute()
			->as_array();

		return array(self::to_user_data($query), array(
			'name' => self::$sort_name[$sort[0]],
			'field' => self::$sort_field[$sort[0]]
		), $wakati_arr, DB::last_query());
	}

	public static function get_upload_code($user_id, $language, $sorting, $offset, $limit)
	{
		$query = DB::select(
			'f_code_id',
			
			'f_code_play_num',
			'f_code_view_num',
			'f_code_favorited_num',
			'f_ranking_regist_num',

			'f_code_title',
			'f_code_open_flg',
			'f_code_length',
			'f_code_date'

		)->from('v_code')
		->where('f_user_id', $user_id);

		// 言語指定
		if ($language !== 'all')
		{
			$query = $query->and_where('f_code_language', $language);
		}

		// 並べ替え
		// 変な値じゃないかチェック & 変換
		$sort = mb_split('_', $sorting);

		if (array_key_exists($sort[0], self::$sort_col) && ($sort[1] == 'desc' || $sort[1] == 'asc'))
		{
			$query = $query->order_by(self::$sort_col[$sort[0]], $sort[1]);

			// 新着に関する並び替えじゃなかった場合だけ、サブ指定を新着順に
			if ($sort[0] != 'date') {
				$query = $query->order_by('f_code_date', 'desc');
			}
		}

		$query = $query->offset($offset)
			->limit($limit)
			->execute()
			->as_array();

		return array(
			self::to_user_data($query),
			self::$sort_name,
			self::$sort_field
		);
	}

	public static function remove_code($code_id, $user_id)
	{
		// コードを削除するときに一緒に削除するテーブルリスト
		$remove_table_list = array(
			't_code' => 1,
			't_ranking' => 0,
			't_code_favorite' => 0
		);

		foreach ($remove_table_list as $table_name => $auth) {

			$query = DB::delete($table_name)
				->where('f_code_id', $code_id);

			if ($auth)
			{
				$query = $query->and_where('f_user_id', $user_id);
			}
			$query = $query->execute();
		}

		return DB::last_query();
	}

	public static function update_code($code_id, $update_data)
	{
		// 形態素解析
		$update_data['fulltext'] = self::to_tiny_segment(array(
			$update_data['code_language'],
			self::get_code_nickname($update_data['code_language']),
			$update_data['title'],
			$update_data['description']
		));

		$query = DB::update('t_code')
			->set(self::to_db_data($update_data))
			->where('f_code_id', $code_id)
			->execute();

		return DB::last_query();
	}
}
