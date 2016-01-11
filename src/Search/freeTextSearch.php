<?php
//echo "hello";
$search = $_POST['search'];
$search = wd_remove_accents($search);

$core = $_POST['core'];
//var_dump($core);
$searchStr = str_replace(": ", "", trim($search));
$searchStr = str_replace(" ", "+", $searchStr);
$url = "http://localhost:8983/solr/".$core."/select?q=".$searchStr."~&df=content&wt=json&indent=true";
//echo $url;
//var_dump($url);
//echo file_get_contents(urldecode($url));
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