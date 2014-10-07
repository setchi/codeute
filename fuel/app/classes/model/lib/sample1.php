<?php
include_once(dirname(__FILE__).'/tiny_segmenter.php');

$input = "日本語の新聞記事であれば文字単位で95%程度の精度で分かち書きが行えます。 ";

$segmenter = new TinySegmenterarray();
$result = $segmenter->segment($input, 'UTF-8');

print_r($result);