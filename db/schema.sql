SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


-- --------------------------------------------------------

--
-- テーブルの構造 `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(40) NOT NULL,
  `previous_id` varchar(40) NOT NULL,
  `user_agent` text NOT NULL,
  `ip_hash` char(32) NOT NULL default '',
  `created` int(10) unsigned NOT NULL default '0',
  `updated` int(10) unsigned NOT NULL default '0',
  `payload` longtext NOT NULL,
  PRIMARY KEY  (`session_id`),
  UNIQUE KEY `PREVIOUS` (`previous_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `sessions`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_code`
--

DROP TABLE IF EXISTS `t_code`;
CREATE TABLE IF NOT EXISTS `t_code` (
  `f_code_id` varchar(30) NOT NULL,
  `f_code_language` varchar(15) default NULL,
  `f_code_num` int(11) default NULL,
  `f_code_play_num` int(11) default '0',
  `f_code_view_num` int(11) default '0',
  `f_user_id` varchar(115) default NULL,
  `f_code_value` mediumtext,
  `f_code_title` varchar(30) default NULL,
  `f_code_description` varchar(200) default NULL,
  `f_code_search` varchar(3000) default NULL,
  `f_code_open_flg` varchar(10) default NULL,
  `f_code_editor_theme` varchar(30) default NULL,
  `f_code_font_size` varchar(2) default NULL,
  `f_code_tip_color` varchar(6) default NULL,
  `f_code_length` int(11) default NULL,
  `f_code_date` datetime default NULL,
  `f_code_last_update_date` datetime default NULL,
  PRIMARY KEY  (`f_code_id`),
  KEY `f_user_id` (`f_user_id`),
  FULLTEXT KEY `f_code_search` (`f_code_search`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `t_code`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_code_favorite`
--

DROP TABLE IF EXISTS `t_code_favorite`;
CREATE TABLE IF NOT EXISTS `t_code_favorite` (
  `f_code_id` varchar(30) default NULL,
  `f_user_id` varchar(115) default NULL,
  `f_date` datetime default NULL,
  KEY `f_user_id` (`f_user_id`),
  KEY `f_code_id` (`f_code_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `t_code_favorite`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_code_play_history`
--

DROP TABLE IF EXISTS `t_code_play_history`;
CREATE TABLE IF NOT EXISTS `t_code_play_history` (
  `f_code_id` varchar(30) default NULL,
  `f_user_id` varchar(115) default NULL,
  `f_total_score` int(11) default NULL,
  `f_total_time` varchar(11) default NULL,
  `f_miss_rate` varchar(5) default NULL,
  `f_type_speed` varchar(5) default NULL,
  `f_max_combo` int(11) default NULL,
  `f_wpm` int(11) default NULL,
  `f_epm` int(11) default NULL,
  `f_line_num` int(11) default NULL,
  `f_date` datetime default NULL,
  KEY `f_user_id` (`f_user_id`),
  KEY `f_code_id` (`f_code_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `t_code_play_history`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_code_view_history`
--

DROP TABLE IF EXISTS `t_code_view_history`;
CREATE TABLE IF NOT EXISTS `t_code_view_history` (
  `f_code_id` varchar(30) default NULL,
  `f_user_id` varchar(115) default NULL,
  `f_date` datetime default NULL,
  KEY `f_user_id` (`f_user_id`),
  KEY `f_code_id` (`f_code_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `t_code_view_history`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_email`
--

DROP TABLE IF EXISTS `t_email`;
CREATE TABLE IF NOT EXISTS `t_email` (
  `f_user_id` varchar(115) default NULL,
  `f_date` datetime default NULL,
  `f_message` mediumtext
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `t_email`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_page_cache`
--

DROP TABLE IF EXISTS `t_page_cache`;
CREATE TABLE IF NOT EXISTS `t_page_cache` (
  `f_user_id` varchar(115) collate utf8_unicode_ci NOT NULL default '',
  `f_uri` varchar(100) collate utf8_unicode_ci NOT NULL default '',
  `f_page` mediumtext collate utf8_unicode_ci,
  `f_cache` mediumtext collate utf8_unicode_ci,
  `f_date` datetime default NULL,
  PRIMARY KEY  (`f_user_id`,`f_uri`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- テーブルのデータをダンプしています `t_page_cache`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_ranking`
--

DROP TABLE IF EXISTS `t_ranking`;
CREATE TABLE IF NOT EXISTS `t_ranking` (
  `f_code_id` varchar(30) NOT NULL,
  `f_user_id` varchar(115) NOT NULL,
  `f_total_score` int(11) default NULL,
  `f_miss_rate` varchar(5) default NULL,
  `f_type_speed` varchar(5) default NULL,
  `f_max_combo` int(11) default NULL,
  `f_total_time` varchar(11) default NULL,
  `f_register_date` datetime default NULL,
  PRIMARY KEY  (`f_code_id`,`f_user_id`),
  KEY `f_user_id` (`f_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- テーブルのデータをダンプしています `t_ranking`
--


-- --------------------------------------------------------

--
-- テーブルの構造 `t_user`
--

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE IF NOT EXISTS `t_user` (
  `f_user_id` varchar(115) character set utf8 NOT NULL,
  `f_user_num` int(11) default NULL,
  `f_user_name` varchar(40) character set utf8 default NULL,
  `f_user_nickname` varchar(25) character set utf8 default NULL,
  `f_user_image` varchar(200) character set utf8 default NULL,
  `f_play_history_last_date` datetime default '0000-00-00 00:00:00',
  `f_view_history_last_date` datetime default '0000-00-00 00:00:00',
  `f_type_chars_last_date` datetime default '0000-00-00 00:00:00',
  `f_type_chars` text character set utf8,
  `f_last_login` datetime default NULL,
  `f_user_setting` text character set utf8,
  PRIMARY KEY  (`f_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- テーブルのデータをダンプしています `t_user`
--


-- --------------------------------------------------------

--
-- ビュー用の代替構造 `v_code`
--
DROP VIEW IF EXISTS `v_code`;
CREATE TABLE IF NOT EXISTS `v_code` (
`f_code_id` varchar(30)
,`f_code_language` varchar(15)
,`f_code_num` int(11)
,`f_code_play_num` int(11)
,`f_code_view_num` int(11)
,`f_user_id` varchar(115)
,`f_code_value` mediumtext
,`f_code_title` varchar(30)
,`f_code_description` varchar(200)
,`f_code_search` varchar(3000)
,`f_code_open_flg` varchar(10)
,`f_code_editor_theme` varchar(30)
,`f_code_font_size` varchar(2)
,`f_code_tip_color` varchar(6)
,`f_code_length` int(11)
,`f_code_date` datetime
,`f_code_last_update_date` datetime
,`f_user_nickname` varchar(25)
,`f_code_favorited_num` bigint(21)
,`f_ranking_regist_num` bigint(21)
);
-- --------------------------------------------------------

--
-- ビュー用の代替構造 `v_code_avg_score`
--
DROP VIEW IF EXISTS `v_code_avg_score`;
CREATE TABLE IF NOT EXISTS `v_code_avg_score` (
`f_code_id` varchar(30)
,`f_code_language` varchar(15)
,`f_code_num` int(11)
,`f_code_play_num` int(11)
,`f_code_view_num` int(11)
,`f_user_id` varchar(115)
,`f_code_value` mediumtext
,`f_code_title` varchar(30)
,`f_code_description` varchar(200)
,`f_code_search` varchar(3000)
,`f_code_open_flg` varchar(10)
,`f_code_editor_theme` varchar(30)
,`f_code_font_size` varchar(2)
,`f_code_tip_color` varchar(6)
,`f_code_length` int(11)
,`f_code_date` datetime
,`f_code_last_update_date` datetime
,`f_avg_score` decimal(14,4)
);
-- --------------------------------------------------------

--
-- ビュー用の代替構造 `v_code_play_history`
--
DROP VIEW IF EXISTS `v_code_play_history`;
CREATE TABLE IF NOT EXISTS `v_code_play_history` (
`f_code_id` varchar(30)
,`f_user_id` varchar(115)
,`f_code_title` varchar(30)
,`f_code_view_num` int(11)
,`f_code_play_num` int(11)
,`f_total_score` int(11)
,`f_total_time` varchar(11)
,`f_miss_rate` varchar(5)
,`f_type_speed` varchar(5)
,`f_max_combo` int(11)
,`f_wpm` int(11)
,`f_epm` int(11)
,`f_line_num` int(11)
,`f_date` datetime
);
-- --------------------------------------------------------

--
-- ビュー用の代替構造 `v_code_sub`
--
DROP VIEW IF EXISTS `v_code_sub`;
CREATE TABLE IF NOT EXISTS `v_code_sub` (
`f_code_id` varchar(30)
,`f_code_language` varchar(15)
,`f_code_num` int(11)
,`f_code_play_num` int(11)
,`f_code_view_num` int(11)
,`f_user_id` varchar(115)
,`f_code_value` mediumtext
,`f_code_title` varchar(30)
,`f_code_description` varchar(200)
,`f_code_search` varchar(3000)
,`f_code_open_flg` varchar(10)
,`f_code_editor_theme` varchar(30)
,`f_code_font_size` varchar(2)
,`f_code_tip_color` varchar(6)
,`f_code_length` int(11)
,`f_code_date` datetime
,`f_code_last_update_date` datetime
,`f_user_nickname` varchar(25)
,`f_code_favorited_num` bigint(21)
);
-- --------------------------------------------------------

--
-- ビュー用の代替構造 `v_code_view_history`
--
DROP VIEW IF EXISTS `v_code_view_history`;
CREATE TABLE IF NOT EXISTS `v_code_view_history` (
`f_code_id` varchar(30)
,`f_user_id` varchar(115)
,`f_code_title` varchar(30)
,`f_code_view_num` int(11)
,`f_code_play_num` int(11)
,`f_date` datetime
);
-- --------------------------------------------------------

--
-- ビュー用の代替構造 `v_ranking`
--
DROP VIEW IF EXISTS `v_ranking`;
CREATE TABLE IF NOT EXISTS `v_ranking` (
`f_code_id` varchar(30)
,`f_user_nickname` varchar(25)
,`f_total_score` int(11)
,`f_miss_rate` varchar(5)
,`f_type_speed` varchar(5)
,`f_max_combo` int(11)
,`f_total_time` varchar(11)
,`f_register_date` datetime
);
-- --------------------------------------------------------

--
-- ビュー用の構造 `v_code`
--
DROP TABLE IF EXISTS `v_code`;

CREATE VIEW `v_code` AS select `v_code_sub`.`f_code_id` AS `f_code_id`,`v_code_sub`.`f_code_language` AS `f_code_language`,`v_code_sub`.`f_code_num` AS `f_code_num`,`v_code_sub`.`f_code_play_num` AS `f_code_play_num`,`v_code_sub`.`f_code_view_num` AS `f_code_view_num`,`v_code_sub`.`f_user_id` AS `f_user_id`,`v_code_sub`.`f_code_value` AS `f_code_value`,`v_code_sub`.`f_code_title` AS `f_code_title`,`v_code_sub`.`f_code_description` AS `f_code_description`,`v_code_sub`.`f_code_search` AS `f_code_search`,`v_code_sub`.`f_code_open_flg` AS `f_code_open_flg`,`v_code_sub`.`f_code_editor_theme` AS `f_code_editor_theme`,`v_code_sub`.`f_code_font_size` AS `f_code_font_size`,`v_code_sub`.`f_code_tip_color` AS `f_code_tip_color`,`v_code_sub`.`f_code_length` AS `f_code_length`,`v_code_sub`.`f_code_date` AS `f_code_date`,`v_code_sub`.`f_code_last_update_date` AS `f_code_last_update_date`,`v_code_sub`.`f_user_nickname` AS `f_user_nickname`,`v_code_sub`.`f_code_favorited_num` AS `f_code_favorited_num`,count(`t_ranking`.`f_code_id`) AS `f_ranking_regist_num` from (`v_code_sub` left join `t_ranking` on((`v_code_sub`.`f_code_id` = `t_ranking`.`f_code_id`))) group by `v_code_sub`.`f_code_id`;

-- --------------------------------------------------------

--
-- ビュー用の構造 `v_code_avg_score`
--
DROP TABLE IF EXISTS `v_code_avg_score`;

CREATE VIEW `v_code_avg_score` AS select `t_code`.`f_code_id` AS `f_code_id`,`t_code`.`f_code_language` AS `f_code_language`,`t_code`.`f_code_num` AS `f_code_num`,`t_code`.`f_code_play_num` AS `f_code_play_num`,`t_code`.`f_code_view_num` AS `f_code_view_num`,`t_code`.`f_user_id` AS `f_user_id`,`t_code`.`f_code_value` AS `f_code_value`,`t_code`.`f_code_title` AS `f_code_title`,`t_code`.`f_code_description` AS `f_code_description`,`t_code`.`f_code_search` AS `f_code_search`,`t_code`.`f_code_open_flg` AS `f_code_open_flg`,`t_code`.`f_code_editor_theme` AS `f_code_editor_theme`,`t_code`.`f_code_font_size` AS `f_code_font_size`,`t_code`.`f_code_tip_color` AS `f_code_tip_color`,`t_code`.`f_code_length` AS `f_code_length`,`t_code`.`f_code_date` AS `f_code_date`,`t_code`.`f_code_last_update_date` AS `f_code_last_update_date`,avg(`t_ranking`.`f_total_score`) AS `f_avg_score` from (`t_code` join `t_ranking` on((`t_code`.`f_code_id` = `t_ranking`.`f_code_id`))) where (`t_code`.`f_code_open_flg` = _utf8'public') group by `t_ranking`.`f_code_id`;

-- --------------------------------------------------------

--
-- ビュー用の構造 `v_code_play_history`
--
DROP TABLE IF EXISTS `v_code_play_history`;

CREATE VIEW `v_code_play_history` AS select `t_code_play_history`.`f_code_id` AS `f_code_id`,`t_code_play_history`.`f_user_id` AS `f_user_id`,`t_code`.`f_code_title` AS `f_code_title`,`t_code`.`f_code_view_num` AS `f_code_view_num`,`t_code`.`f_code_play_num` AS `f_code_play_num`,`t_code_play_history`.`f_total_score` AS `f_total_score`,`t_code_play_history`.`f_total_time` AS `f_total_time`,`t_code_play_history`.`f_miss_rate` AS `f_miss_rate`,`t_code_play_history`.`f_type_speed` AS `f_type_speed`,`t_code_play_history`.`f_max_combo` AS `f_max_combo`,`t_code_play_history`.`f_wpm` AS `f_wpm`,`t_code_play_history`.`f_epm` AS `f_epm`,`t_code_play_history`.`f_line_num` AS `f_line_num`,`t_code_play_history`.`f_date` AS `f_date` from (`t_code_play_history` join `t_code` on((`t_code_play_history`.`f_code_id` = `t_code`.`f_code_id`)));

-- --------------------------------------------------------

--
-- ビュー用の構造 `v_code_sub`
--
DROP TABLE IF EXISTS `v_code_sub`;

CREATE VIEW `v_code_sub` AS select `t_code`.`f_code_id` AS `f_code_id`,`t_code`.`f_code_language` AS `f_code_language`,`t_code`.`f_code_num` AS `f_code_num`,`t_code`.`f_code_play_num` AS `f_code_play_num`,`t_code`.`f_code_view_num` AS `f_code_view_num`,`t_code`.`f_user_id` AS `f_user_id`,`t_code`.`f_code_value` AS `f_code_value`,`t_code`.`f_code_title` AS `f_code_title`,`t_code`.`f_code_description` AS `f_code_description`,`t_code`.`f_code_search` AS `f_code_search`,`t_code`.`f_code_open_flg` AS `f_code_open_flg`,`t_code`.`f_code_editor_theme` AS `f_code_editor_theme`,`t_code`.`f_code_font_size` AS `f_code_font_size`,`t_code`.`f_code_tip_color` AS `f_code_tip_color`,`t_code`.`f_code_length` AS `f_code_length`,`t_code`.`f_code_date` AS `f_code_date`,`t_code`.`f_code_last_update_date` AS `f_code_last_update_date`,`t_user`.`f_user_nickname` AS `f_user_nickname`,count(`t_code_favorite`.`f_code_id`) AS `f_code_favorited_num` from ((`t_code` left join `t_code_favorite` on((`t_code`.`f_code_id` = `t_code_favorite`.`f_code_id`))) join `t_user` on((`t_code`.`f_user_id` = `t_user`.`f_user_id`))) group by `t_code`.`f_code_id`;

-- --------------------------------------------------------

--
-- ビュー用の構造 `v_code_view_history`
--
DROP TABLE IF EXISTS `v_code_view_history`;

CREATE VIEW `v_code_view_history` AS select `t_code_view_history`.`f_code_id` AS `f_code_id`,`t_code_view_history`.`f_user_id` AS `f_user_id`,`t_code`.`f_code_title` AS `f_code_title`,`t_code`.`f_code_view_num` AS `f_code_view_num`,`t_code`.`f_code_play_num` AS `f_code_play_num`,`t_code_view_history`.`f_date` AS `f_date` from (`t_code_view_history` join `t_code` on((`t_code_view_history`.`f_code_id` = `t_code`.`f_code_id`)));

-- --------------------------------------------------------

--
-- ビュー用の構造 `v_ranking`
--
DROP TABLE IF EXISTS `v_ranking`;

CREATE VIEW `v_ranking` AS select `t_ranking`.`f_code_id` AS `f_code_id`,`t_user`.`f_user_nickname` AS `f_user_nickname`,`t_ranking`.`f_total_score` AS `f_total_score`,`t_ranking`.`f_miss_rate` AS `f_miss_rate`,`t_ranking`.`f_type_speed` AS `f_type_speed`,`t_ranking`.`f_max_combo` AS `f_max_combo`,`t_ranking`.`f_total_time` AS `f_total_time`,`t_ranking`.`f_register_date` AS `f_register_date` from (`t_ranking` join `t_user` on((`t_ranking`.`f_user_id` = `t_user`.`f_user_id`)));
