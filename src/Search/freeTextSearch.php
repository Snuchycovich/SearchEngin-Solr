<?php
//echo "hello";
$search = $_POST['search'];
$search = wd_remove_accents($search);

$core = $_POST['core'];
//var_dump($core);
$searchStr = str_replace(": ", "", trim($search));
$searchStr = str_replace(" ", "+", $searchStr);

$searchParamsArray = explode(" ", $search);
$outParamsUrl = "";
foreach ($searchParamsArray as $key => $value) {
    if($key == 0)
        $outParamsUrl .= "%2B$value~";
    else
        $outParamsUrl .= "+$value~";
}
// print_r($searchParamsArray);
$url = "http://localhost:8983/solr/crawl_two/select?q=%28title%3A%28".$outParamsUrl."%29+AND+introtext%3A%28".$outParamsUrl."%29%29+OR+%28title%3A%28".$outParamsUrl."%29+OR+introtext%3A%28".$outParamsUrl."%29%29+OR+%28content%3A%28".$outParamsUrl."%29%29&wt=json&indent=true";
//echo $url;
//var_dump($url);
// echo file_get_contents(urldecode($url));
echo chargement($url);


function chargement($url)
{
    $urls = $url;
    //$proxy = "http://proxy.unicaen.fr:3128";
    $curl = curl_init();
    //curl_setopt($curl, CURLOPT_PROXY, $proxy);
    curl_setopt($curl, CURLOPT_URL, $urls);
    curl_setopt($curl, CURLOPT_ENCODING, "");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    return $data;
}

function wd_remove_accents($str, $charset='utf-8')
{
    $str = htmlentities($str, ENT_NOQUOTES, $charset);

    $str = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str);
    $str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str); // pour les ligatures e.g. '&oelig;'
    $str = preg_replace('#&[^;]+;#', '', $str); // supprime les autres caractères

    return $str;
}