$(document).ready(function(){
	var crawl = "first";

	$('.crawl').click(function(){
		crawl = $(this).attr('id');
		$('#entities').children().remove();
		$('#searchResult').children().remove();
		var search = $('#search').val();
		//alert("click");
		$.ajax({
			type: 'POST',
			url: 'src/Search/entiteSearch.php',
			data: {"search": search},
			success: function(data){
				//alert(data);
				var liste = $.parseJSON(data);
				//alert(liste);
				//console.log(liste.itemListElement);
					
				$.each(liste.itemListElement, function(i, element) {
					var html = '<div class="entity">';
					var name = '<h3>'+element['result']['name']+'</h3>';
					var desc = '<p>'+element['result']['description']+'</p>';
					var article = '<p>'+element['result']['detailedDescription']['articleBody']+'</p>';

					html += name;
					html += desc;
					html += article;
					html += '</div>';
					
					//alert(element['result']['image']['url']);
					//var img = '<img src="'+element['result']['name']+'" alt="">';
					
					$(html).appendTo('#entities');
					//$('hello').appendTo('#searchResult');*/
				});
					
				//$(search).appendTo('#searchResult');
					
			},
			error: function(err){
				console.log(err);
			}
		});	
	})
	$('#'+crawl).click(function(){
		var search = $('#search').val();
		$.ajax({
			type: 'POST',
			url: 'src/Search/freeTextSearch.php',
			data: {"search": search, "core": "tika"},
			success: function(data){
				//alert(data);
				console.log(data);
				var liste = $.parseJSON(data);
				//alert(liste.response.docs);
				//console.log(liste.itemListElement);
				var html = '<h2>Search on CNET</h2>';
				html += '<p>'+liste.response['numFound']+' resultats pour "'+search+'"</p>';
				$.each(liste.response.docs, function(i, element) {
					html += '<div class="freeTextSearch">';
					html += '<div class="row"><div class="col-md-9">'
					var name = '<h3>'+element['title']+'</h3>';
					var content = (element['content'])?'<p>'+element['content']+'</p>':'';
					var image = '<img src="'+element['preview_image']+'" alt="'+name+'"/>';
					//var article = '<p>'+element['result']['detailedDescription']['articleBody']+'</p>';

					html += name;
					html += content;
					html += '</div><div class="col-md-3">'
					html += image;
					html += '</div></div></div>';
					
					//alert(element['result']['image']['url']);
					//var img = '<img src="'+element['result']['name']+'" alt="">';
					
					
					//}
				});
				
				$(html).appendTo('#searchResult');
				
					
			},
			error: function(err){
				console.log(err);
			}
		});	

	});
	
});