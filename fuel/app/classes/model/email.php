<?php

class Model_Email extends Model
{
	public static function post_message($value)
	{

		DB::insert('t_email')
			->set($value)
			->execute();

		return DB::last_query();
	}
}
