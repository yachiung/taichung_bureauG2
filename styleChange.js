$(document).ready(function(){


	$('body').prepend('<div class="change"><ul class="style"><li class="A">styleA</li><li class="B">styleB</li><li class="C">styleC</li></ul> <ul class="gutter"><li class="g">gutter</li><li class="g1">gutter1</li></ul></div>').css('padding-top','3em');


	var change = $('.change'),
			_styleA = change.find('li.A'),
			_styleB = change.find('li.B'),
			_styleC = change.find('li.C'),
			_gutter = change.find('li.g'),
			_gutter1 = change.find('li.g1');



	_styleA.click(function(){
		$('link[href*="style"]').attr("href","css/styleA.css");
		$(this).addClass('now').siblings().removeClass('now');
	})
	_styleB.click(function(){
		$('link[href*="style"]').attr("href","css/styleB.css");
		$(this).addClass('now').siblings().removeClass('now');
	})
	_styleC.click(function(){
		$('link[href*="style"]').attr("href","css/styleC.css");
		$(this).addClass('now').siblings().removeClass('now');
	})

	_gutter.click(function(){
		$(this).toggleClass('now').siblings().removeClass('now');
		$('.row').removeClass('gutter1').toggleClass('gutter');
	})
	_gutter1.click(function(){
		$('.row').removeClass('gutter').toggleClass('gutter1');
		$(this).toggleClass('now').siblings().removeClass('now');
	})



});