<?php
	if(isset($_GET['savoron_twitter'])) header('Location: http://twitter.com/Savoron');
	if(isset($_GET['trewbot_twitter'])) header('Location: http://twitter.com/Trewbot');
	if(isset($_GET['graphene'])) header('Location: http://gra.phene.co');
	if(isset($_GET['haranox'])) header('Location: http://haranox.com');
	if(isset($_GET['random_video'])) {
		$vids = array(
			"https://www.youtube.com/watch?v=h7bl4lAoCQQ",
			"https://www.youtube.com/watch?v=GFAgSengYuM",
			"https://www.youtube.com/watch?v=ndI9xOvbt1I",
			"https://www.youtube.com/watch?v=2vjLBxvuC5Y",
			"https://www.youtube.com/watch?v=53FQjWPfmok",
			"https://www.youtube.com/watch?v=_vMsLWpHMLc",
			"https://www.youtube.com/watch?v=jgDb0uvQVgU",
			"https://www.youtube.com/watch?v=Ur4eCm__FRw",
			"https://www.youtube.com/watch?v=TysctR7tcos",
			"https://www.youtube.com/watch?v=h97vAOVowv8"
		);
		header("Location: ".$vids[rand(0, count($vids) - 1)]);
	}
?>