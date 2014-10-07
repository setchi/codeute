<?php

$code_list = Model_Code::$nickname;
$res = '';

foreach($code_list as $key => $val)
{
	$res.= '<option value="'.$key.'">'.$val.'</option>';
}

echo $res;
