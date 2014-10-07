$(function () {

	$('.togglefav').mousedown(toggleFav);


	var posting = false;
	function toggleFav() {

		if (!posting) {
			posting = true;

			var favorited = !$(this).hasClass('favorited');

			if (favorited) {
				$(this).addClass('favorited').attr('title', 'お気に入りから削除');

			} else {
				$(this).removeClass('favorited').attr('title', 'お気に入りに追加');
			}


			$.post('/code/favorite/' + $(this).data('favorite-id') + '/' + favorited + '.json', function (d) {

				posting = false;
			});
		}

		return false;
	}
});
