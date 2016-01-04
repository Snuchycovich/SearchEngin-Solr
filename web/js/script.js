$(document).ready(function(){
	$('.crawl').click(function(){
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
				console.log(liste.itemListElement);
				var search = '<h2>Search on CNET</h2>';
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
					
				$(search).appendTo('#searchResult');
					
			},
			error: function(err){
				console.log(err);
			}
		});	
	})
});