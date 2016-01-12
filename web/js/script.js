$(document).ready(function(){
	$Spelling.DefaultDictionary = "Francais"; //French Dictionary
	$Spelling.UserInterfaceTranslation = "fr";
	//$(function() {$('#search').spellAsYouType({defaultDictionary:'Francais',checkGrammar:true,showLanguagesInContextMenu:false});});

	(function() {

		var element = $('#text-content');

		/*// Init the text spellchecker
		var spellchecker = new $.SpellChecker(element, {
			lang: 'fr',
			parser: 'text',
			webservice: {
				path: 'src/webservices/php/SpellChecker.php',
				driver: 'pspell'
			},
			suggestBox: {
				position: 'above'
			},
			incorrectWords: {
				container: '#incorrect-word-list'
			}
		});*/

		// Bind spellchecker handler functions
		spellchecker.on('check.success', function() {
			alert('There are no incorrectly spelt words.');
		});

		// Check the spelling
		$("#check-textarea").click(function(e){
			spellchecker.check();
		});
	})();


	$('.crawl').click(function(){
		var id = $(this).attr('id');
		$("#spell").remove();
		var o = $Spelling.AjaxDidYouMean($('#search').val());

		o.onDidYouMean = function(result){
			//alert(result)
			if(result && !result.contains("*PHP Spellcheck Trial*") && result!="") {
				html = '<div id="spell" class="row"><div class="span6" style="float: none; margin: 0 auto;">Essayez avec cette orthographe : <a id="suggestionLink" href="#">' + result + '</a></div></div>'
				$(html).insertAfter('.header');
				$("#suggestionLink").click(function () {
					$('#search').val(result);
					$("#spell").remove();
					findResults(id);
				})
			}
		}

		findResults(id);


	});

	var findResults = function(id){
		var search = $('#search').val().replaceArray(stop_w,' ');
		if (search) {
			$.ajax({
				type: 'POST',
				url: 'src/Search/entiteSearch.php',
				data: {"search": search},
				success: function(data){
					var liste = $.parseJSON(data);
					$.each(liste.itemListElement, function(i, element) {
						if (element['result']['name']){
							var html = '<div class="entity">';

						if (!!element['result']['detailedDescription'] && !!element['result']['detailedDescription']['url']) {
							var name = '<a target="_blank" href="' + element['result']['detailedDescription']['url'] + '"><h3>' + element['result']['name'] + '</h3></a>';
						} else
							var name = '<h3>' + element['result']['name'] + '</h3>';
						var desc = (!!element['result']['description']) ? '<p class="entityType">' + element['result']['description'] + '</p>' : '';

						html += name;
						if (element.result.image)
							html += '<figure><img class="icon" src="' + element.result.image.contentUrl + '"/><figure>';
						html += desc;
						if (!!element['result']['detailedDescription'] && !!element['result']['detailedDescription']['articleBody']) {

							html += '<p>' + element['result']['detailedDescription']['articleBody'] + '</p>';
						}
						html += '</div>';

						$(html).appendTo('#entities');
						$("#entities").highlight(search.split(" "));
					}
					});

				},
				error: function(err){
					console.log(err);
				}
			});


			if(id == "first")
				core = "crawl_one";
			else if(id == "second")
				core = "crawl_two";
			else if(id == "third")
				core = "crawl_three";

			$('#entities').children().remove();
			$('#searchResult').children().remove();

			$.ajax({
				type: 'POST',
				url: 'src/Search/freeTextSearch.php',
				data: {"search": search, "core": core},
				success: function(data){
					console.log(data);
					var liste = $.parseJSON(data);
					var html = '<h2>Search on CNET</h2>';
					html += '<p class="nbResults"><strong>'+liste.response['numFound']+'</strong> resultats pour <strong>"'+$('#search').val()+'"</strong></p>';
					$.each(liste.response.docs, function(i, element) {
						if(!!element['url'])
							html+='';
						html += '<div class="row freeTextSearch">';
						html += '<div class="col-md-12">'
						var urlToFilename = element['url'];
						var fileName= urlToFilename.split("/");
						var name = '<h3><a target="_blank" href="'+element['url']+'"><img src="'+element['preview_image']+'" alt="'+element['title']+'">'+element['title']+'</a></h3>';
						var url = '<a class="url" target="_blank" href="'+element['url']+'" title="Page originale">'+element['url']+'</a> <a target="_blank" href="http://localhost:8983/solr/'+core+'/'+fileName[4]+'" title="Page en cache"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></a>';
						var content = (element['content'])?'<p>'+element['content']+'</p>':'';

						html += name;
						html += url;
						html += content;
						//html += '</div><div class="col-md-2"><div class="vertical-center"> ';
						//html+='<img src="'+element['preview_image']+'" alt="">';
						//html += '</div></div></div>';

						/*if(!!element['url'])
						 html+='</a>';*/

					});

					$(html).appendTo('#searchResult');
					$(".freeTextSearch").highlight(search.split(" "));


				},
				error: function(err){
					console.log(err);
				}
			});
		}
	}


});

String.prototype.replaceArray = function(find, replace) {
	var replaceString = this;
	for (var i = 0; i < find.length; i++) {
		var regex = new RegExp(" "+find[i]+" ", "gi");
		replaceString = replaceString.replace(regex, replace);
		//replaceString = replaceString.replace(find[i]+" ", "");
	}
	return replaceString;
};

var stop_w = ["alors","au",
	"aucuns",
	"aussi",
	"autre",
	"avant",
	"avec",
	"avoir",
	"bon",
	"car",
	"ce",
	"cela",
	"ces",
	"ceux",
	"chaque",
	"ci",
	"comme",
	"comment",
	"dans",
	"de",
	"des",
	"du",
	"dedans",
	"dehors",
	"depuis",
	"devrait",
	"doit",
	"donc",
	"dos",
	"début",
	"elle",
	"elles",
	"en",
	"encore",
	"essai",
	"est",
	"et",
	"eu",
	"fait",
	"faites",
	"fois",
	"font",
	"hors",
	"ici",
	"il",
	"ils",
	"je",
	"juste",
	"la",
	"le",
	"les",
	"leur",
	"là",
	"ma",
	"maintenant",
	"mais",
	"mes",
	"mine",
	"moins",
	"mon",
	"mot",
	"même",
	"ni",
	"nommés",
	"notre",
	"nous",
	"ou",
	"où",
	"par",
	"parce",
	"pas",
	"peut",
	"peu",
	"plupart",
	"pour",
	"pourquoi",
	"quand",
	"que",
	"quel",
	"quelle",
	"quelles",
	"quels",
	"qui",
	"sa",
	"sans",
	"ses",
	"seulement",
	"si",
	"sien",
	"son",
	"sont",
	"sous",
	"soyez",
	"sujet",
	"sur",
	"ta",
	"tandis",
	"tellement",
	"tels",
	"tes",
	"ton",
	"tous",
	"tout",
	"trop",
	"très",
	"tu",
	"voient",
	"vont",
	"votre",
	"vos",
	"un",
	"une",
	"vous",
	"vu",
	"ça",
	"étaient",
	"état",
	"étions",
	"été",
	"être","\:","\.","\,","\;","\/","\?"]
