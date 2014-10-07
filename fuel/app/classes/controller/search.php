<?php

class Controller_Search extends Controller_Rest
{
	public function action_index()
	{
		$limit = 16;

		$ajax = Input::get('ajax', false);
		$query = Input::get('q', '');
		$offset = Input::get('p', 0) * $limit;
		$sorting = Input::get('s', 'date_desc');
		$language = Input::get('lang', 'all');

		$data = Model_Code::search_code_fulltext($query, $language, $sorting, Session::get('user_info.id'), $limit, $offset);
		$end = count($data[0]) < $limit;

		if ($ajax) {
			$wakati_re = self::create_wakati($data[2]);
			$htmlJSON = self::create_json($data[0], $data[1], $wakati_re);

			return $this->response(array(
				'html' => $htmlJSON,
				'state' => $sorting.$language,
				'end' => $end
			));

		} else {
			$view = View::forge('search/search');
			$view->set_global('user_info', Session::get('user_info'));

			$view->head = View::forge('head');
			$view->header = View::forge('header');
			$view->footer = View::forge('footer');
			$view->lang_list = View::forge('lang_list');
			$view->auto_filter(false);
			$view->query = $query;

			return Response::forge(Model_Html::minify($view));
		}
	}

	private static function create_json($data, $label_data, $wakati_re)
	{

		$res = array();
		$description_limit = 23;

		foreach($data as $val) {
			$title = $val['title'];

			if (mb_strlen($title) > $description_limit) {
				$title = mb_substr($title, 0, $description_limit).'…';
			}
			$code_id = join('-', mb_split('\/', $val['code_id']));

			$res[] = array('li', array('class' => 'result-code span6'), array(
				array('h4', $val['open'] === 'private' ? array('class' => 'private', 'title' => 'このコードは非公開に設定されています') : '', self::highlighting($title, $wakati_re)),
				array('a', array('href' => $val['code_id'], 'class' => 'thumbnail'), array(

					array('div', array(
						'class' => 'span12 code-thumbnail code-loading',
						'data-code' => $val['code_id'],
						'data-theme' => $val['editor_theme'],
						'style' => 'font-size: '.(intval($val['font_size'])*0.8).'px'
					), htmlspecialchars($val['code'])),

					array('span', array('class' => 'language'), self::highlighting(Model_Code::get_code_nickname($val['code_language']), $wakati_re)),
					array('span', array('class' => 'label pull-right'), self::set_label($label_data, $val)),
					array('span', array('class' => 'label rank pull-right'), $val['rank'] === null ? '' : $val['rank'].'位/'.$val['ranking_regist_num'].'人中')
				))
			));
		}

		$res = array('div', '', $res);
		return $res;
	}


	private static function highlighting($str, $wakati)
	{
		$res = '';

		if ($wakati != '/()/i') {
			$res = preg_replace($wakati, '<strong>$1</strong>', htmlspecialchars($str));

		} else {
			$res = htmlspecialchars($str);
		}
		
		return $res;
	}

	private static function set_label($data, $val)
	{
		$res = $data['name'];

		if ($data['field'])
		{
			$res .= ": ".($data['field'] == 'date' ? substr($val[$data['field']], 0, 10) : $val[$data['field']]);
		}

		return $res;
	}

	private static function create_wakati($data)
	{
		$res = array();

		for ($i = 0, $len = count($data); $i < $len; $i++)
		{
			foreach ($data[$i] as $key => $value)
			{
				if ($value)
				{
					$res[] = preg_replace('/^\/$/', '\/', preg_quote($value));
				}
			}
		}
		$res = '/('.join('|', $res).')/i';

		return $res;
	}
}
