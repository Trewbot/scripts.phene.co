<?
	header("Content-Type:application/javascript");
	$files = array_diff(scandir(getcwd()), array('..','.'));
	$max = '0.0.0.0';
	for($i = 0; $i < 4; $i++)
		foreach($files as $file)
			if(preg_match('/\d\.\d\.\d\.\d{4}/',$file) === 1 && intval(explode('.',$file)[$i]) > intval(explode('.',$max)[$i])) $max = $file;
	readfile($max);