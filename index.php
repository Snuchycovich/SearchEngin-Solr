<?php

require_once __DIR__.'/vendor/autoload.php';
require_once __DIR__.'/vendor/test.php';


$app = new Silex\Application();

$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

$name = "Emiliano"; 
$app->get('/', function () use ($app, $name) {

    return $app['twig']->render('home.html.twig', array(
        'name' => $name,
        ));
});

$app->get('add', function () {

    return 'add';

}
);

$blogPosts = array(
    1 => array(
        'date'      => '2011-03-29',
        'author'    => 'igorw',
        'title'     => 'Using Silex',
        'body'      => '...',
    ),
);

$app->get('/blog/{id}', function (Silex\Application $app, $id) use ($blogPosts) {
    if (!isset($blogPosts[$id])) {
        $app->abort(404, "Post $id does not exist.");
    }

    $post = $blogPosts[$id];

    return  "<h1>{$post['title']}</h1>".
            "<p>{$post['body']}</p>";
}
);



$app->run();
