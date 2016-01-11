<?php

$search = $_POST['search'];
$searchStr = str_replace(" ", "+", $search);
$url = 'https://kgsearch.googleapis.com/v1/entities:search?query='.$searchStr.'&key=AIzaSyBR5wi0L9VHC-kmeECbyJCiVazoMRThZVA&limit=10&languages=fr&indent=True';
/*
$data =
$data = json_decode($data,true)['itemListElement'];*/
echo file_get_contents($url);//json_encode($data);
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
