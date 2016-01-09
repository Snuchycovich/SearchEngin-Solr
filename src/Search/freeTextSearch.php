<?php

$search = $_POST['search'];
$core = $_POST['core'];
//var_dump($core);
$searchStr = str_replace(" ", "+", $search);
//var_dump($searchStr);
$url = "http://localhost:8983/solr/".$core."/select?q=".$searchStr."~&df=title&wt=json&indent=true";
//var_dump($url);
echo file_get_contents($url);
//echo chargement($url);


function chargement($url)
{
    $urls = $url;
    $proxy = "http://proxy.unicaen.fr:3128";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_PROXY, $proxy);
    curl_setopt($curl, CURLOPT_URL, $urls);
    curl_setopt($curl, CURLOPT_ENCODING, "");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    return $data;
}
