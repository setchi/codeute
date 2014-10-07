<?php
include_once(dirname(__FILE__).'/tiny_segmenter.php');

mb_detect_order('ASCII,JIS,UTF-8,EUC-JP,SJIS');

$input = "日本語の新聞記事であれば文字単位で95%程度の精度で分かち書きが行えます。 ";

$segmenter = new TinySegmenterarray();
$result = $segmenter->segment($input);

print_r($result);