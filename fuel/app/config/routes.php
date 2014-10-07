<?php

$language_list = join('|', array(
	'abap',
	'actionscript',
	'assembly_x86',
	'c',
	'cpp',
	'c_cpp',
	'cobol',
	'coffee',
	'csharp',
	'css',
	'clojure',
	'd',
	'dart',
	'erlang',
	'forth',
	'golang',
	'groovy',
	'haskell',
	'haxe',
	'html',
	'java',
	'javascript',
	'jsx',
	'lisp',
	'lsl',
	'lua',
	'matlab',
	'mysql',
	'objectivec',
	'ocaml',
	'pascal',
	'perl',
	'php',
	'prolog',
	'python',
	'r',
	'ruby',
	'rust',
	'scala',
	'scheme',
	'sh',
	'typescript',
	'vbscript',
	'verilog',
	'xml',
	'xquery'
));

return array(
	'_root_'  => 'home/index',  // The default route
	'_404_'   => 'home/404',    // The main 404 route

	'login' => 'home/login',
	'logout' => 'home/logout',

	'new'  => 'home/new',  // 新規作成
	'new-user' => 'home/newuser',

	'about' => 'home/about',

	
	//'code'  => 'code/index',  // The default route
	/*
	'upload' => 'upload/',
	'search' => 'search/',
	'mypage' => 'account/mypage',
	/**/


	// コードたち
	'('.$language_list.')/(\d{1,10})' => array(array('GET', new Route('home/typing/$1/$2')), array('POST', new Route('code/getcode/$1/$2'))),

	// 編集
	'edit/('.$language_list.')/(\d{1,10})' => array(array('GET', new Route('home/edit/$1/$2'))),
	
);
