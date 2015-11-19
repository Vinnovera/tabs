!function(w, d, $) {

	var $tabBar, $tabs, iAmSuper = false. iAmDouble = false;

	$(d).on('ready', function() {
		$tabBar = $('.tab-bar'),
		$tabs = $('.tab');

		sortTabs();
		bindEvents();
	});

	function bindEvents() {
		$(d).on('click', '.add-new', onAddNewClick);
		$(d).on('click', '.close-all', onCloseAllClick);
		$(d).on('click', '.close-all-but-active', onKeepActiveClick);
		$(d).on('click', '.close-all-but-pinned', onKeepPinnedClick);

		//Tab clicks
		$(d).on('click', '.tab-content', onTabContentClick);
		$(d).on('click', '.close', onCloseClick);
		$(d).on('click', '.pin', onPinClick);
	}

	function sortTabs(){
		$tabBar.sortable({
				axis: "x",
				placeholder: "tab placeholder",
				sort: function( event, ui ) {
					$tabBar.addClass('sorting-tab');
					ui.item.removeClass('moved');
					ui.item.addClass('sorting');
				},
				stop: function( event, ui ) {
					$tabBar.removeClass('sorting-tab');
					ui.item.addClass('moved');
					ui.item.attr('style','');
					ui.item.removeClass('sorting');
				},
		});
	
		$tabs.disableSelection();
	}

	function onPinClick(e){
		e.preventDefault();
		var $tab = $(e.target).closest('.tab');

		$tab.toggleClass('pinned');
	}

	function onTabContentClick(e){
		e.preventDefault();
		var $tab = $(e.target).closest('.tab');

		$('.tab').removeClass('active');
		$tab.addClass('active');
		resizeTabBar();
	}

	function onCloseClick(e){
		e.preventDefault();
		var $tab = $(e.target).closest('.tab');

		$tab.addClass('closing');
		setTimeout(function(){ $tab.remove(); },500);
		resizeTabBar();
	}

	function onAddNewClick(e){

			e.preventDefault();
			var randomIndex = Math.floor(Math.random() * $tabs.length),
				tabClone = $tabs.eq(randomIndex);
				
			tabClone.clone().removeClass('active pinned closing').appendTo( $tabBar );
			resizeTabBar();
	}

	function onCloseAllClick(e){
			e.preventDefault();
			$('.tab').addClass('closing');
			setTimeout(function(){
				$('.tab').remove();
				cleanTabBar();
				//resizeTabBar();
			},500);
			
	}

	function onKeepActiveClick(e){
			e.preventDefault();
			$('.tab:not(.active)').addClass('closing');
			setTimeout(function(){
				$('.tab:not(.active)').remove();
				if (!iAmSuper || !iAmDouble) {
					cleanTabBar();
					resizeTabBar();
				}
			},500);
			
	}

	function onKeepPinnedClick(e){
			e.preventDefault();
			$('.tab:not(.pinned)').addClass('closing');
			setTimeout(function(){
				$('.tab:not(.pinned)').remove();
				if (!iAmSuper || !iAmDouble) {
					cleanTabBar();
					resizeTabBar();
				}
			},500);
	}

	function cleanTabBar(){
		$tabBar.removeClass('condensed super-condensed');
		iAmSuper = false;
		iAmDouble = false;
	}

	function resizeTabBar(){
		var
			viewportWidth = $(w).width(),
			tabsWidth = ($('.tab').width() - 32) * $('.tab').length,
			doubleWidth = viewportWidth * 2;

		/*var tabsWidth = 0;
		$('.tab').each(function(){
			tabsWidth = tabsWidth + ($(this).width() - 32);
		});*/

		/*console.log('normal: ' + tabsWidth);


		if(tabsWidth >= doubleWidth || iAmSuper) {
			$tabBar.addClass('super-condensed').removeClass('condensed');
			console.log('double: ' + tabsWidth);
			iAmSuper = true;
		} else if(tabsWidth > viewportWidth && tabsWidth < doubleWidth && !iAmSuper) {
			$tabBar.addClass('condensed').removeClass('super-condensed');
			console.log('condensed: ' + tabsWidth);
			iAmDouble = true;
		}else{
			iAmSuper = false;
			iAmDouble = false;
		}*/
		
		$('.tab-bar').width(tabsWidth);
	}

	
}(window, document, jQuery);