<?php

require_once __DIR__.'/vendor/autoload.php';
require_once __DIR__.'/vendor/test.php';


$app = new Silex\Application();

$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

$app->get('/', function () use ($app) {

    return $app['twig']->render('home.html.twig');
});

$app->get('home', function () use ($app) {

    return $app['twig']->render('home.html.twig');
});

$app->get('add', function () {

    return 'add';

}
);

$app->run();
