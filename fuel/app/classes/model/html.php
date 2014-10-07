<?php
require_once APPPATH.'classes/model/vendor/autoload.php';

class Model_Html extends Model
{
	public static function minify($view, $uri = false)
	{
		// viewオブジェクトを強制レンダリングして文字列化
		$view = $view->render();
		// minify時のオプション
		$minifyOption = array(
			'doctype' => 'html5',
			'optimizationLevel' => 1
		);

		// uriが指定されていなかった場合は、強制的にminifyして返す
		if ($uri === false)
		{
			return zz\Html\HTMLMinify::minify($view, $minifyOption);
		}
		$user_id = Session::get('user_info.id', '');

		// $user_idと$uriをもとに、該当する圧縮データを取得
		$query = DB::select('f_page', 'f_cache')
			->from('t_page_cache')
			->where('f_user_id', $user_id)
			->and_where('f_uri', $uri)
			->limit(1)->execute()->as_array();

		// 検索結果が存在した場合
		if (0 < count($query))
		{
			// 圧縮前HTMLが等しかったら、キャッシュを返す
			if ($query[0]['f_page'] === $view)
			{
				return $query[0]['f_cache'];
			}
			// 圧縮前HTMLが違っていたら、圧縮し直し＆DB更新
			else
			{
				$minview = zz\Html\HTMLMinify::minify($view, $minifyOption);
				DB::update('t_page_cache')
					->set(array(
						'f_page' => $view,
						'f_cache' => $minview,
						'f_date' => date('Y-m-d H:i:s')

					))->where('f_user_id', $user_id)
					->and_where('f_uri', $uri)
					->execute();

				return $minview;
			}
		}
		// 検索結果が存在しない場合、DBにデータを追加する
		else
		{
			$minview = zz\Html\HTMLMinify::minify($view, $minifyOption);
			$query = DB::insert('t_page_cache')
				->set(array(
					'f_user_id' => $user_id,
					'f_uri' => $uri,
					'f_page' => $view,
					'f_cache' => $minview,
					'f_date' => date('Y-m-d H:i:s')
				))->execute();

			return $minview;
		}
	}
}
