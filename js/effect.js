var _window = $(window),
			ww = _window.width(),
			wh = _window.height(),
			_body = $('body'),
			_header = $('.header'),
			_menu = _header.find('.menu'),
			hh = _header.outerHeight(true),
			_search = $('.search'),
			_footer = $('.footer'),
			wwNormal = 1000,
			wwMedium = 800,
			wwSmall = 600,
			wwxs = 420;

$( '.main' ).append( '<div class="overlay"></div>' );//產生遮罩
var _overlay = $('.overlay');


$(document).ready(function(){

	$('html').removeClass('no-js');
 
	//gotop
	var _goTop = $('.goTop');
	_goTop.on('click', function(){
		$('html,body').stop(true,false).animate({scrollTop:0},700, function () { 
			$('.goCenter').focus();//20191224
		});
	});
	_window.scroll(function(){
		if ( $(this).scrollTop() > 250){
			_goTop.stop(true,false).fadeIn('fast');
		} else {
			_goTop.stop(true,false).fadeOut('fast');
		}
	});


	
	// 按 Enter 到主內容區
	$('a.goCenter').keydown(function(e){
		e.preventDefault();
		if(e.which == 13) { 
			_window.scrollTop( hh - _menu.innerHeight() + 5 );
			$('.accesskey#aC').focus();
		}
	});

	// 20190628 社群有多層選單
	var snsSpeed = 240;
	$('.sns').each(function(){
		var _sns = $(this);
		var _snsHasChild = _sns.find('li').has('ul');
		_snsHasChild.addClass('hasChild').children('a').attr('href','#not_a-link');
		_snsHasChild.hover(
			function(){
				$(this).children('ul').stop(true, true).slideDown(snsSpeed);
			},
			function(){
				$(this).children('ul').stop(true, true).slideUp(snsSpeed);
			}
		);
		_snsHasChild.children('a').focus(function(e){
			$(this).next('ul').stop(true, true).slideDown(snsSpeed);
			$(this).next('ul').children('li').last().children('a').blur(function(){
				$(this).parent('li').parent('ul').stop(true, true).slideUp(snsSpeed);
				e.preventDefault();
			});
		})
	})


	webSiteMenu();
	fixHeader();
	// fatfootCtrl();
	share();	
	popMessage();

	// mobileSearch();	
	mobileCategory();

	clickToSlide();
	photoShow();
	qa();
	tabSet();
	evenColH();
	drawer();
	optionGp();


	if (ww <= wwMedium ) {
		$('.list, .thumbnail, .profileList').jscroll({
			contentSelector: '.list, .thumbnail, .profileList'
		});
	}
	rwdTable();
	
});



var resizeTimer1;
$(window).resize(function(){
	clearTimeout(resizeTimer1);
	resizeTimer1 = setTimeout(function(){
		ww = $(window).width();
		tabSet();
		evenColH();
		searchTop();
 	} , 250);
});

function webSiteMenu(){//主選單
	_menu.find('li').has('ul').addClass('hasChild');
	var liHasChild = _menu.find('li.hasChild'),
			subMenuWidth = liHasChild.first().children('ul').outerWidth();

	liHasChild.hover(
		function(){
			var _showing = $(this).children('ul');
			_showing.stop().fadeIn(200);
			showingMenu(_showing);
		},
		function(){$(this).children('ul').stop().fadeOut(200);}
	);
	liHasChild.keyup(
		function(){
			var _showing = $(this).children('ul');
			_showing.show();
			showingMenu(_showing);
			$(this).siblings().focus(function(){$(this).hide();});
	});

	function showingMenu(_showing){
		var  showingOffset = _showing.offset().left;
		if (showingOffset+subMenuWidth > ww) {
			_showing.css({left: -1*subMenuWidth+5, top:5});
		}
	}

	_menu.find('li').keyup(	
		function(){
			$(this).siblings().children('ul').hide();
		});
	_menu.find('li:last>a').focusout(
		function(){
			_menu.find('li ul').hide();
	});


	var _megaMenu = $('.header .megaMenu>ul'),
			maxH = wh-hh-40;
	
	_megaMenu.find('li:has(ul)').addClass('hasChild');

	var _megaSubMenu = _megaMenu.children('li.hasChild').children('ul');
	_megaSubMenu.css('max-height',maxH);

	_megaMenu.children('li.hasChild').hover(
		function(){$(this).children().stop().fadeIn(200)},
		function(){$(this).children('ul').stop().fadeOut(200)}
	)
	_megaMenu.children('li.hasChild').keyup(
		function(){
			$(this).children().show();
			$(this).siblings().focus(function(){
				$(this).hide()
			});
		});
	_megaMenu.children('li').keyup(	
		function(){
			$(this).siblings().children('ul').hide();
		});
	$('.header .megaMenu li:last>a').focusout(function(){
		$('.header .megaMenu li ul').hide();}
	)

	//複製所需區塊到.sidebar
  var _sidebar = $('.sidebar');	
	$('.navigation').clone().prependTo( _sidebar );
	_menu.clone().prependTo( _sidebar);
	_megaMenu.parent().clone().prependTo( _sidebar);
	_sidebar.find('.megaMenu').addClass('menu');

	//行動版 menu
	// ---------- 2024/9/23 無障礙修改 ---------- //
	var _mobileMenu = _sidebar.find('.menu');
	var _mobileMenuA = _mobileMenu.find('li.hasChild>a');
	var _mobileMenuFirstA = _mobileMenu.children('ul').children('li').first().children('a');

	_mobileMenuA.click(function(e){
		$(this).next().slideToggle();
		$(this).parent().toggleClass('closeThis');
		e.preventDefault();
	});

	function showSidebar(){
		_sidebar.show(10, function(){
			$(this).addClass('show');
		})
		_overlay.show(0, function(){
			$(this).fadeTo('400', 0.5);
		});
		_mobileMenuFirstA.trigger('focus');
	}

	function hideSidebar(){
		_sidebar.removeClass('show');
		_overlay.fadeTo('400', 0, function () {
			_overlay.hide();
			_sidebar.removeAttr('style');
		});
		_sidebarCtrl.trigger('focus');
	}

	var _sidebarClose = $('.sidebarClose');
	var	_sidebarCtrl = $('.sidebarCtrl');	
	_overlay.parent().css('min-height', 'inherit');


	_sidebarCtrl.on('click', function () {
		if (_overlay.is(':visible')) {
			hideSidebar();
		} else {
			showSidebar();
		}
	});

	_overlay.add(_sidebarClose).on('click' ,function() {
			hideSidebar();	
	});

	_sidebarClose.on('keydown', function(e){
		if( !e.shiftKey && e.key==='Tab' ) {
			e.preventDefault();
			_mobileMenuFirstA.trigger('focus');
		}
	})
}



function fixHeader(){//固定版頭
	var menuH = _menu.outerHeight();
			// navH = $('.navbar').height();

	_window.scroll(function(){
		if (ww>wwNormal && $(this).scrollTop() > hh-menuH ){
			$('.header').addClass('fixed');
			// _body.offset({top: menuH});
			_body.offset({top: hh });
		} else if ( ww<=wwNormal && $(this).scrollTop() > 0 ){
			$('.header').addClass('fixed');
			_body.offset({top:hh});
		} else {
			$('.header').removeClass('fixed');
			_body.offset({top:0});
		}
	});
}

	// Fatfooter 開合
	var	_ffCtrl = _footer.find('.fatfootCtrl'),
			_fatfooter = _footer.find('nav>ul>li>ul, .qrcode, .deco ');
	
	// ---------- 2024/5 無障礙修改 ---------- //
	_ffCtrl.attr('aria-label', '頁腳選單展開/收合').text('控制按鈕');
	if(_fatfooter.is(':hidden')){
		_ffCtrl.addClass('close').attr('aria-expanded', false);
	} else {
		_ffCtrl.removeClass('close').attr('aria-expanded', true);
	}

	// ---------- 2024/5 無障礙修改 ---------- //
	_ffCtrl.click(function(){
		if(_fatfooter.is(':hidden')){
			_fatfooter.stop().slideDown(function(){
				_ffCtrl.removeClass('close').attr('aria-expanded', true);
			});
		} else {
			_fatfooter.slideUp(function(){
				_ffCtrl.addClass('close').attr('aria-expanded', false);
			});
		}
	})


	// ---------- 2024/5 無障礙修改 ---------- //
	// 分頁顯示筆數 select 元件加 aria-label 屬性（2024 無障礙修改）
	$('.page').find('select').attr('aria-label', '每頁顯示筆數');


	// ---------- 2024/9/23 無障礙修改 ---------- //
	// 行動版查詢
	var _searchCtrl = $('.searchCtrl');
	var _searchLastA = _search.find('a.btnAdv');
	_searchCtrl.on('click', function(){
		if( _search.is(':hidden')) {
			_search.css('top', _header.outerHeight(true) ).slideDown(250, function(){
				_search.find('input[type="text"]').trigger('focus');
			});
		} else {
			_search.slideUp(250, function(){
				_searchCtrl.trigger('focus');
				_search.removeAttr('style');
			});
		}
	});

	// 行動版 search 開啟時 tab 回查詢開關
	if( ww < wwNormal) {
		_searchLastA.on('keydown', function(e){
			if ( !e.shiftKey && e.key=='Tab' ) {
				e.preventDefault();
				_searchCtrl.trigger('focus');
			}
		})
		_searchCtrl.on('keydown' , function(e){
			if( _search.is(':visible') &&  !e.shiftKey && e.key==='Tab') {
				e.preventDefault();
				_search.find('input[type="text"]').trigger('focus');
			}
		})
	}


	// function mobileSearch(){//行動版查詢
	// 	// if(ww<wwNormal){_search.css('top', hh);}
	// 	// searchTop();
	// 	// _search.slideToggle();
	// 	// _searchCtrl.toggleClass('close');
	// }

	function searchTop() {
		if( _window.width()<wwNormal ){
			_search.css('top', _header.outerHeight(true));}
		else {
			// _search.attr('style','');
			_search.removeAttr('style');
		}
	}





function mobileCategory(){//行動版資料大類開合
	if(ww<=wwMedium){
		let _category = $('.category');
		let _cateList = _category.find('ul');
		_category.find('.here a').clone().insertBefore(_cateList).addClass('here');
		_category.append('<button class="cateCtrl"></button>');
		let _cateCtrl = _category.find('.cateCtrl');
		let	_cateHere = _category.find('a.here');

		const speed = 300;

		_cateCtrl.add(_cateHere).on('click', function(){
			if( _cateList.is(':hidden') ) {
				_cateCtrl.addClass('close');
				_cateList.slideDown(speed, function(){
					_cateList.find('li.here a').trigger('focus');
				});
				_cateHere.slideUp(speed);
			} else {
				_cateCtrl.removeClass('close');
				_cateList.slideUp(speed);
				_cateHere.slideDown(speed, function(){
					$(this).trigger('focus');
				});
			}
		});
		_cateList.find('li>a').on('click', function(){
			_cateList.find('.here').removeClass('here');
			$(this).parent('li').addClass('here');
			_cateHere.text($(this).text());
			if(_cateList.is(':visible')){
				_cateList.slideUp(speed);
				_cateHere.slideDown(speed, function(){
					$(this).trigger('focus');
				});
			};
				_cateCtrl.removeClass('close');
		});
	}
}

//分享
function share(){

	var _share = $('.share');
	$('.shareThis').click(function(){
		_share.show();
		_overlay.show().fadeTo('300', 0.5);
	});

	var svt;
	_share.children('span').first().replaceWith('<button type="button" aria-label="分享到社群平台" aria-expanded="false">分享</button>');
	var _shareBtn = _share.find('button');
	_shareBtn.after('<span class="after">《</span>');
	var _shareAfter = _share.find('.after');

	_shareAfter.hide();

	function miniShare(){
		_share.stop(true, true).animate({ width:"1.1em"}, 600).find('ul').stop(true, true).slideUp(600, 
			function(){
				_shareAfter.show(200);
				_shareBtn.attr('aria-expanded', 'false');
			}
		);
	}
	function showShare(){
		_shareAfter.hide();
		_shareBtn.attr('aria-expanded', 'true');
		_share.stop(true, true).animate({ width:"48px"},300).find('ul').stop(true, true).slideDown(300);
	}
	if (ww > wwNormal) {
		svt = setTimeout(miniShare , 2000);		
		_share.hover(showShare,miniShare);
		_share.children('button').focusin(showShare);
		_share.find('li').last().children('a').focusout(miniShare);
	}
	if (ww <= wwNormal) {
		clearTimeout(svt);
		_share.find('ul').append( '<li class="close">離開</li>' );
		_share.find('li').click(function(){
			_share.hide();
			_overlay.fadeTo('300', 0, function(){$(this).hide();});
		});
		_overlay.click(function() {
			_share.hide();
		});
	}
}

function tabSet(){//頁籤

	$('.tabs').each(function(){

		var _tab = $(this),
				_tabItem = _tab.find('.tabItem'),
				_tabItemA = _tabItem.children('a'),
				_tabContent = _tab.find('.tabContent'),
				tabwidth = _tab.width(),
				tabItemHeight = _tabItem.outerHeight(),
				tabContentHeight = _tab.find('.active').next().innerHeight();
				tabItemLength = _tabItem.length,
				tabItemWidth = tabwidth / tabItemLength;

		_tabItemA.attr('aria-selected', 'false').attr('role', 'tab');
		_tabItem.filter('.active').find('a').attr('aria-selected',  'true');
		_tab.find('.active').next('.tabContent').show();

		if(ww > wwSmall ){
			_tabContent.css('top' , tabItemHeight );
			_tab.height(tabContentHeight + tabItemHeight);
			_tabItem.width(tabItemWidth);
			_tabItem.last().css({position:"absolute", top:"0", right:"0"}).width(tabItemWidth+1);
		} else {
			_tab.css('height','auto');
			_tabItem.width(tabwidth);
			_tabItem.last().css('position','relative');
		}

		_tabItemA.focus(tabs);
		_tabItemA.click(tabs);
	
		function tabs(e){
			var	_tabItemNow = $(this).parent(),
					tvp = _tab.offset().top,
					tabIndex = _tabItemNow.index()/2,
					scollDistance = tvp + tabItemHeight*tabIndex -hh;

			_tabItem.removeClass('active').find('a').attr('aria-selected',  'false');
			_tabItemNow.addClass('active').find('a').attr('aria-selected',  'true');

			if(ww <= wwSmall){
				if(! $(this).parents('.tabs').hasClass('albumType4')){// .albumType4.tab 另外處理
					_tabItem.not('.active').next().slideUp();
					_tabItemNow.next().slideDown();
					$("html,body").stop(true,false).animate({scrollTop:scollDistance});
				}
			} else {
				_tabItem.not('.active').next().hide();
				_tabItemNow.next().show();
				tabContentHeight = _tabItemNow.next().innerHeight();
				_tab.height(tabContentHeight + tabItemHeight);
			}
		    e.preventDefault();
			}
	});
}

function qa(){//QA 常見問答
	var _qaList = $('.qa').find('li'),
			_iniShowAns = _qaList.slice(0, 2),
			_qq = _qaList.find('.question>a');

	_qaList.addClass('hiddenAns');
	_iniShowAns.removeClass('hiddenAns');

	_qq.click(qaSlide);
	_qq.focus(qaSlide);

	function qaSlide(e){
		if($(this).parents('li').hasClass('hiddenAns')){
			$(this).parent().next('.answer').slideDown(function(){
				$(this).parent('li').removeClass('hiddenAns');
			})
		} else {
			$(this).parent().next('.answer').slideUp(function(){
				$(this).parent('li').addClass('hiddenAns');
			});
		}
			e.preventDefault();
	}
}

function clickToSlide(){//click 左右箭頭滑動
	if (ww >= 200) {
		$('.ckSlide').each(function(){

			var _ckSlide = $(this),
					_ckSlideList = _ckSlide.find('ul'),
					_ckSlideItem = _ckSlideList.find('li'),
					length = _ckSlideItem.length,
					boxHeight = _ckSlideItem.innerHeight(),
					itemWidth = _ckSlideItem.outerWidth(true),
					_arLeft = _ckSlide.find('.arbtn.left'),
					_arRight = _ckSlide.find('.arbtn.right'),
					listLeft = 0;

			_ckSlideList.width(itemWidth * length).wrap('<div class="showArea"></div>');

			var _showArea = _ckSlide.find('.showArea');
			_showArea.height(boxHeight);
			
			_arLeft.add(_arRight).css('top', _showArea.position().top + boxHeight*.5);

			if(_ckSlideList.width() > _showArea.width() && length > 1){
				_ckSlideList.css({'position':'absolute','left':0,'top':0});
				_arRight.show();

				// var rightLimit = _showArea.width() - _ckSlideList.width() + itemWidth;
				var rightLimit = Math.ceil( _showArea.width() + itemWidth - _ckSlideList.width() );
				
				_arRight.click(function(){
					_arLeft.fadeIn();
					if ( parseInt( _ckSlideList.css('left')) <= rightLimit ){$(this).fadeOut();}
					_ckSlideList.stop(true,false).animate({	'left': listLeft-itemWidth },500,function(){
						listLeft = listLeft-itemWidth;
					});
				});

				_arLeft.click(function(){
					_arRight.fadeIn();
					if ( parseInt(_ckSlideList.css('left')) >= -1*itemWidth ){$(this).fadeOut()};
					_ckSlideList.stop(true,false).animate({	'left': listLeft+itemWidth },500,function(){
						listLeft = listLeft+itemWidth;
					});

				});
			} else {
				_arLeft.add(_arRight).hide();
			}
		});
	}
}

function evenColH(){//並排直欄設為等高

	if(ww > wwNormal){
		$('.row').each(function(){
			var _col = $(this).children('section').not('.slide, .tabs, .marquee');
			if( _col.length>1 ){colHeight(_col);}
		});
	} else if (ww > wwMedium) {
		$('.row').children('section').not('.slide, .tabs, .marquee').height('auto');
		$('.row').not('.cx3a, .cx3b, .cx3c, .cx2a, .cx2b').each(function(){			
				var _col = $(this).children('section').not('.slide, .tabs, .marquee');
				colHeight(_col);
		});
	} else {
		$('.row').children('section').not('.slide, .tabs, .marquee').height('auto');	
	} 

	if ( ww <= wwNormal && ww > wwSmall) {
		$('.cx4').each(function(){
			var _col = $(this).children('section').slice(0,2);
			colHeight(_col);
			var _col = $(this).children('section').slice(2);
			colHeight(_col);
		});
		$('.cx3a').each(function(){
			var _col = $(this).children('section').slice(1);
			colHeight(_col);
		});
		$('.cx3b').each(function(){
			var _col = $(this).children('section').slice(0,2);
			colHeight(_col);
		});	
	}


	function colHeight(_col){ //取並排直欄最大高
		var colH = [];
		_col.each(function(){
			colH.push($(this).innerHeight());
		});
		colH.sort(function(a, b){return b - a});
		_col.innerHeight(colH[0]);
	}

}

function popMessage(){//彈出訊息
  var _popMsg = $('.popMessage'),
  		_closePop = _popMsg.find('.closePop');

	_popMsg.before('<div class="popMask"></div>');
	var _popMask = $('.popMask');

	_popMsg.add(_popMask).show();

	_closePop.on('click' ,function(){
		_popMsg.add(_popMask).fadeOut(300);
	});

	_popMask.click(function(){
		$(this).add(_popMsg).fadeOut(300);
	})
}

function photoShow(){//相簿內頁

	$('.album').each(function(){

		var _album = $(this),
				_photoList = _album.find('.photoShow'),
				_photoShow = _photoList.find('li'),
				_photoThumb = _album.find('.photoThumb').find('li'),
				photoCount = _photoThumb.length,
				duration = 2500,
				tt = setInterval(autoShow, duration);
		
		_photoList.append('<span class="photoCount"><em>1'+ '</em> / ' +photoCount + '</span>');
		var _photoCounter =  _photoList.find('.photoCount').find('em');
		_photoList.append('<div title="上一張" class="arbtn left"></div><div title="下一張" class="arbtn right"></div>');

		_photoThumb.first().addClass('active');
		_photoShow.find('.caption').hide().end().find('a').css('z-index', 0);
		_photoShow.first().find('img').show().parent('a').css('z-index', 88).next('.caption').show();

		_photoList.after('<div class="ppause"></div>');

		var ppCtrl = $('.ppause');
		if(ww <= wwSmall){
			var hini = _photoShow.first().height();
			$('.photoShow').height(hini);
			
			ppCtrl.click(function(){
				$(this).toggleClass('pplay')
				if (ppCtrl.hasClass('pplay')){
					clearInterval(tt);
				} else {
					tt = setInterval(autoShow, duration);
				}
			})
		};

		var i = 0;
		var _btnNext = _photoList.find('.right'),
				_btnPrev = _photoList.find('.left');

		_btnNext.click(function(){i = (i+1) % photoCount; showPhoto();});
		_btnPrev.click(function(){i = (i-1) % photoCount; showPhoto();});

		_photoThumb.find('a').click(function(e){
			i = $(this).parent('li').index();
			showPhoto();
			e.preventDefault();
		});
		_photoThumb.find('a').focus(function(){
			clearInterval(tt);
			i = $(this).parent('li').index();
			showPhoto();
		});
		_photoShow.find('a').focus(function(){
			clearInterval(tt);
			$(this).removeAttr('style');
			i = $(this).parent().index();
			showPhoto();
		});
		_photoShow.find('a').keydown(function(ev){
			var tabCode = ev.which || ev.keyCode;
			if(ev.shiftKey==1 && i==0 && tabCode==9){
				tt = setInterval(autoShow, duration);
			}
		});
		_photoThumb.find('a').keydown(function(ev){
			var tabCode = ev.which || ev.keyCode;
			if(ev.shiftKey==0 && i==photoCount-1 && tabCode==9){
				tt = setInterval(autoShow, duration);
			}
		});
		$('.photoShow, .photoThumb li').hover(
			function(){clearInterval(tt);},
			function(){
				if ( !(ppCtrl.hasClass('pplay')) ) {
					tt = setInterval(autoShow, duration);
				}
			}
		);
		function autoShow(){
			i = (i+1) % photoCount;
			showPhoto();
		}
		function showPhoto(){
			_photoThumb.eq(i).addClass('active').siblings().removeClass('active');
			_photoShow.find('.caption').hide().prev('a').css('z-index', 0);
			_photoShow.eq(i).find('img').stop(true,false).fadeIn().parent('a').css('z-index', 88).next('.caption').fadeIn();
			_photoShow.eq(i).siblings().find('img').stop(true,false).fadeOut();
			if(i <= -1){
				_photoCounter.text(i+photoCount+1);
			} else {
				_photoCounter.text(i+1);
			}			
			if(ww <= wwSmall){
				var	photoHeight = _photoShow.eq(i).height();
				$('.photoShow').animate({height:photoHeight});
			}
		}

	});

}

// 隱藏／展開
function drawer(){
	$('.aDrawer').each(function(){
		var _aDrawer = $(this);
		_aDrawer.wrapInner('<div class="toggleArea"></div>');
		_aDrawer.prepend('<button class="toggleCtrl" title="點擊可展開或收合">開合</button>');
		var _toggleArea = _aDrawer.find('.toggleArea'),
				_toggleCtrl = _aDrawer.find('.toggleCtrl');

		_toggleCtrl.after('<span class="hint">按 enter 鍵展開／收合，按 tab 鍵往下游走</span>');

		if(_aDrawer.hasClass('animalSearch')){
			_aDrawer.prepend('<span class="drawerCaption">' + _aDrawer.find('caption').html() + '</span>');
			_aDrawer.find('caption').hide();
		} else {
			_aDrawer.find('h3').addClass('drawerCaption').prependTo(_aDrawer);
		}
		var _drawerCaption = _aDrawer.find('.drawerCaption');

		_toggleCtrl.add(_drawerCaption).click(function(){
			if(_toggleArea.is(':visible')){
				_toggleArea.stop(true, true).slideUp(500, function(){_aDrawer.addClass('closed')});
			} else {
				_toggleArea.stop(true, true).slideDown(500, function(){_aDrawer.removeClass('closed')});
			}
		});
		_toggleCtrl.on('keyup', function(){
			$(this).next('.hint').stop(true, true).fadeIn(200).delay(5000).fadeOut(500);
		});
	});
}


//checkbox and radio redesign
function optionGp(){	
  $('.optionGp').each(function(){
    var _optionGp = $(this),
        _radioOption = _optionGp.find('input[type="radio"]'),
        _checkOption = _optionGp.find('input[type="checkbox"]');

    _optionGp.has(_radioOption).addClass('single');
    _optionGp.has(_checkOption).addClass('multi');
    _optionGp.find('input[checked]').parent().addClass('isSelected');

    _radioOption.click(function(){
    	_radioOption.removeAttr('checked').parent().removeClass('isSelected');
      $(this).attr('checked','checked').parent().addClass('isSelected');
    });
    _radioOption.add(_checkOption).focus(function(){
    	$(this).parent().css('border-color','#ffc');
    })
    _radioOption.add(_checkOption).focusout(function(){
    	$(this).parent().css('border-color','transparent');
    })


    _checkOption.click(function(){
      if( $(this).parent().hasClass('isSelected') ){
        $(this).removeAttr('checked').parent().removeClass('isSelected');
      } else {
        $(this).attr('checked','checked').parent().addClass('isSelected');
      }
    });
  })
}



	//條列頁上方的查詢區 20201126 
	// copy from ../main/js/app.js
	var _searchInlp = $('.searchInlp');
	_searchInlp.each(function(){
		var _this = $(this);
		var _toggleArea = _this.find('.toggleArea');

		_toggleArea.before('<button class="slideCtrl"></button>');
		_toggleArea.before('<span class="caption"></span>').before('<button class="slideCtrl"></button>');
		var _caption = _this.find('.caption').text(_this.find('caption').text());
		var _slideCtrl = $(this).find('.slideCtrl');

		// ---------- 2024/5 無障礙修改 ---------- //
		if(_toggleArea.is(':visible')){
				_slideCtrl.removeClass('closed').attr('aria-expanded', true);
				_caption.hide();
		} else {
			_slideCtrl.addClass('closed').attr('aria-expanded', false);
			_caption.show();
		}

		_slideCtrl.add(_caption).click(function(){
			if(_toggleArea.is(':visible')){
				_toggleArea.slideUp();
				_slideCtrl.addClass('closed').attr('aria-expanded', false);
			} else {
				_toggleArea.slideDown();
				_slideCtrl.removeClass('closed').attr('aria-expanded', true);
			}
		});
	})



// 取副檔名
// function attIcons(){
// 	var _attIconList = $('.list').find('td').find('.attIcons');
// 	var _attIcon = _attIconList.children('li').children('a');

// 	_attIcon.each(function(){
// 		var filename = $(this).attr('title').toString();
// 		var n = filename.indexOf(".")+1;
// 		fileType = filename.slice(n);
// 		$(this).text(fileType).addClass(fileType);

// 	});
// }


// function snsMenu(){

// }